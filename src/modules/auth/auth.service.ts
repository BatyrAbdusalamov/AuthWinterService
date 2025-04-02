import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { maxAgeAccessSec, maxAgeRefreshSec } from 'src/constant/cookieConst';
import { EnvConst } from 'src/constant/envConst';
import { AuthLoginDto, AuthRegDto } from 'src/requestData/AuthDto';
import { UserDto, UserResponseDto } from 'src/responseData/UserDto';
import { UserService } from 'src/modules/user/user.service';

interface JwtPayLoad {
  guid: string;
  dateStart: number;
  expiriesIn: number;
  login?: string;
  email?: string;
  fingerprint: string;
}

interface JwtTokens {
  'access-token': string;
  'refresh-token': string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  //Проверка валидности refresh токена и создание новых JWT токенов
  async validRefreshToken(
    refreshToken: string,
    fingerprint: string,
  ): Promise<JwtTokens> {
    if (!refreshToken || !fingerprint) {
      throw new Error('Unknown refresh-token or fingerprint');
    }
    const tokenPayload: JwtPayLoad = await this.jwtService.decode(refreshToken);
    if (
      Number(tokenPayload.expiriesIn) < Date.now() ||
      tokenPayload.fingerprint !== fingerprint
    ) {
      throw new Error('Invalid refresh-token');
    }

    const userData = await this.userService.getUserInfoInGuid(
      tokenPayload.guid,
      ['password'],
    );
    if (!userData) throw new Error('User not found');

    const validRefreshToken = await this.jwtService.signAsync(tokenPayload, {
      secret: this.configService
        .get<string>(EnvConst[0])
        ?.concat(userData?.password),
    });

    if (refreshToken !== validRefreshToken) {
      throw new Error('Invalid refresh-token');
    }

    return await this.generateTokens(
      userData,
      fingerprint,
      refreshToken,
      tokenPayload.expiriesIn,
    );
  }

  //Проверка валидности access токена
  async validAccessToken(
    accessToken: string,
    fingerprint: string,
  ): Promise<boolean> {
    const tokenPayload: JwtPayLoad = await this.jwtService.decode(accessToken);
    if (
      Number(tokenPayload.expiriesIn) < Date.now() ||
      tokenPayload.fingerprint !== fingerprint
    ) {
      return false;
    }

    const validAccessToken = await this.jwtService.signAsync(tokenPayload, {
      secret: this.configService.get<string>(EnvConst[0]),
    });

    if (accessToken !== validAccessToken) {
      return false;
    }

    return true;
  }

  //Генерация новых токенов JWT
  private async generateTokens(
    userData: UserDto,
    fingerprint: string,
    prevRefreshToken?: string,
    prevExpiriesIn?: number,
  ): Promise<JwtTokens> {
    const getTokenPayload = (token: keyof JwtTokens): JwtPayLoad => {
      switch (token) {
        case 'access-token':
          return {
            guid: userData.guid,
            dateStart: Date.now(),
            expiriesIn: Date.now() + maxAgeAccessSec * 1000,
            login: userData.login,
            email: userData.email,
            fingerprint,
          };
        case 'refresh-token':
          return {
            guid: userData.guid,
            dateStart: Date.now(),
            expiriesIn: prevExpiriesIn ?? Date.now() + maxAgeRefreshSec * 1000,
            fingerprint,
          };
      }
    };
    const refreshToken = !prevRefreshToken
      ? await this.jwtService.signAsync(getTokenPayload('refresh-token'), {
          secret: this.configService
            .get<string>(EnvConst[0])
            ?.concat(userData.password),
        })
      : prevRefreshToken;
    const accessToken = await this.jwtService.signAsync(
      getTokenPayload('access-token'),
      {
        secret: this.configService.get<string>(EnvConst[0]),
      },
    );

    return { 'refresh-token': refreshToken, 'access-token': accessToken };
  }

  //Регистрация нового пользователя
  async registryUser(authData: AuthRegDto, fingerprint: string) {
    const userData = await this.userService.createUser(authData);
    const jwtTokens = await this.generateTokens(userData, fingerprint);
    return {
      jwtTokens,
      user: new UserResponseDto(userData),
    };
  }

  async loginUser(authData: AuthLoginDto, fingerprint: string) {
    if (!fingerprint) throw new Error('Invalid fingerprint');

    const userData = await this.userService.verifyPassword(authData.password, {
      login: authData.login,
    });

    const jwtTokens = await this.generateTokens(userData, fingerprint);
    return { jwtTokens, userData: new UserResponseDto(userData) };
  }
}
