import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { maxAgeAccessSec, maxAgeRefreshSec } from 'src/constant/cookieConst';
import { EnvConst } from 'src/constant/envConst';
import { AuthLoginDto, AuthRegDto } from 'src/requestData/AuthDto';
import { UserDto } from 'src/responseData/UserDto';
import { UserService } from 'src/modules/user/user.service';
import { RoleService } from '../role/role.service';

interface JwtPayLoad {
  guid: string;
  dateStart: number;
  expiriesIn: number;
  login?: string;
  email?: string;
  tags: string[];
  role?: number;
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
    private roleService: RoleService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  //Проверка валидности refresh токена и создание новых JWT токенов
  async validRefreshToken(
    refreshToken: string,
    fingerprint: string,
  ): Promise<JwtTokens> {
    if (!refreshToken || !fingerprint) {
      throw new HttpException('Unknown refresh-token or fingerprint', 401);
    }
    const tokenPayload: JwtPayLoad = await this.jwtService.decode(refreshToken);
    if (tokenPayload.fingerprint !== fingerprint) {
      throw new HttpException('Сессия недействительна', 401);
    }
    const userData = await this.userService.getUserInfoInGuid(
      tokenPayload.guid,
      ['password', 'guid', 'role', 'login', 'email'],
    );
    if (!userData) throw new HttpException('Пользователь не найден', 400);

    const validRefreshToken = await this.jwtService.signAsync(tokenPayload, {
      secret: this.configService
        .get<string>(EnvConst[0])
        ?.concat(userData?.password),
    });

    if (refreshToken !== validRefreshToken) {
      throw new HttpException('Invalid refresh-token', 401);
    }
    const userTags = await this.roleService.getRoleInfoInId(userData.role);

    if (!userTags?.tags) {
      throw new HttpException('Ошибка роли', 401);
    }

    return await this.generateTokens(
      userData,
      fingerprint,
      userTags?.tags,
      refreshToken,
      tokenPayload.expiriesIn,
    );
  }

  //Проверка права доступа по роли
  async parseAccessToken(token: string, tagsGuard: string[]): Promise<any> {
    const tokenPayload: JwtPayLoad = await this.jwtService.decode(token);
    if (
      tokenPayload?.tags &&
      tagsGuard?.some((tag) => tokenPayload.tags.includes(tag))
    ) {
      return true;
    } else {
      return false;
    }
  }

  //Проверка валидности access токена
  async validAccessToken(
    accessToken: string,
    fingerprint: string,
    isVerify?: boolean,
  ): Promise<boolean | UserDto> {
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

    if (isVerify) {
      const userData =
        (await this.userService.getUserInfoInGuid(tokenPayload.guid)) ?? false;
      if (!userData) throw new HttpException('Пользователь не найден', 400);
    }

    return true;
  }

  //Генерация новых токенов JWT
  private async generateTokens(
    userData: UserDto,
    fingerprint: string,
    tags: string[],
    prevRefreshToken?: string,
    prevExpiriesIn?: number,
  ): Promise<JwtTokens> {
    const getTokenPayload = (token: keyof JwtTokens): JwtPayLoad => {
      switch (token) {
        case 'access-token':
          return {
            guid: userData.guid,
            tags: tags,
            dateStart: Date.now(),
            expiriesIn: Date.now() + maxAgeAccessSec * 1000,
            login: userData.login,
            email: userData.email,
            fingerprint,
          };
        case 'refresh-token':
          return {
            guid: userData.guid,
            tags: tags,
            role: userData.role,
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
    const userTags = await this.roleService.getRoleInfoInId(userData.role);
    if (!userTags?.tags) {
      throw new Error('Invalid role');
    }
    const jwtTokens = await this.generateTokens(
      userData,
      fingerprint,
      userTags.tags,
    );
    return {
      jwtTokens,
      user: userData,
    };
  }

  async loginUser(authData: AuthLoginDto, fingerprint: string) {
    if (!fingerprint) throw new Error('Invalid fingerprint');

    const userData = await this.userService.verifyPassword(authData.password, {
      login: authData.login,
    });
    const userTags = await this.roleService.getRoleInfoInId(userData.role);
    if (!userTags?.tags) {
      throw new Error('Invalid role');
    }

    const jwtTokens = await this.generateTokens(
      userData,
      fingerprint,
      userTags.tags,
    );
    return { jwtTokens, userData: userData };
  }
}
