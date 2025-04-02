import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ResponseErrorDto,
  getErrorResponse,
} from 'src/responseData/ResponseErrorDto';
import { Request, Response } from 'express';
import {
  ACCESS_TOKEN_OPTIONS,
  maxAgeAccessSec,
  maxAgeRefreshSec,
  REFRESH_TOKEN_OPTIONS,
  REQ_RES_COOKIE,
} from 'src/constant/cookieConst';
import { UserDto, UserResponseDto } from 'src/responseData/UserDto';
import { AuthLoginDto, AuthRegDto } from 'src/requestData/AuthDto';
import { Fingerprint, IFingerprint } from 'nestjs-fingerprint';

interface CreatingUserData extends UserDto {
  login: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  photo?: string;
}

interface JwtTokens {
  'access-token': string;
  'refresh-token': string;
}

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setResponseTokens(
    res: Response,
    jwtTokens: JwtTokens,
    prevRefreshExpires?: Date,
  ) {
    const getExpires = (timePeriodSecond: number): Date => {
      const date = new Date(Date.now() + timePeriodSecond * 1000);
      return date;
    };
    res.cookie(REQ_RES_COOKIE.REFRESH, jwtTokens[REQ_RES_COOKIE.REFRESH], {
      ...REFRESH_TOKEN_OPTIONS,
      expires: prevRefreshExpires ?? getExpires(maxAgeRefreshSec),
    });
    res.cookie(REQ_RES_COOKIE.ACCESS, jwtTokens[REQ_RES_COOKIE.ACCESS], {
      ...ACCESS_TOKEN_OPTIONS,
      expires: getExpires(maxAgeAccessSec),
    });
  }

  @Get('refresh')
  @ApiCookieAuth('refresh-token')
  @ApiResponse({
    status: 201,
    description: 'Успешно',
    type: undefined,
  })
  @ApiResponse({
    status: 401,
    description: 'Невалидный refresh-token',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервиса',
    type: ResponseErrorDto,
  })
  async refreshedToken(
    @Res({ passthrough: true }) res: Response,
    @Req() { cookies }: Request,
    @Fingerprint() { id: fingerprint }: IFingerprint,
  ): Promise<ResponseErrorDto | null> {
    try {
      // eslint-disable-next-line prettier/prettier
      const refreshToken = cookies?.[REQ_RES_COOKIE.REFRESH] as string | string[];
      const jwtTokens = await this.authService.validRefreshToken(
        Array.isArray(refreshToken) ? refreshToken[0] : refreshToken,
        Array.isArray(fingerprint) ? fingerprint[0] : fingerprint,
      );
      this.setResponseTokens(res, jwtTokens, new Date(cookies?.Expires));
      res.statusCode = 201;
      return null;
    } catch (error) {
      return getErrorResponse(error, res, 401);
    }
  }

  @Post('registry')
  @ApiBody({
    required: true,
    description: 'Данные для регистрации',
    type: AuthRegDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Пользователь зарегистрирован успешно',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Не корректые данные для регистрации или Пользователь уже существует',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервиса',
    type: ResponseErrorDto,
  })
  async registryUser(
    @Body() userData: any,
    @Res({ passthrough: true }) res: Response,
    @Fingerprint() { id: fingerprint }: IFingerprint,
  ): Promise<ResponseErrorDto | UserResponseDto> {
    try {
      const { jwtTokens, user } = await this.authService.registryUser(
        userData,
        Array.isArray(fingerprint) ? fingerprint[0] : fingerprint,
      );
      this.setResponseTokens(res, jwtTokens);
      res.statusCode = 200;
      return user;
    } catch (error: unknown) {
      return getErrorResponse(error, res);
    }
  }

  @Post('login')
  @ApiBody({
    required: true,
    description: 'Данные для авторизации',
    type: AuthLoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно авторизован',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Не корректые данные для входа или пользователя не существует',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервиса',
    type: ResponseErrorDto,
  })
  async loginUser(
    @Body() authData: CreatingUserData,
    @Res({ passthrough: true }) res: Response,
    @Fingerprint() { id: fingerprint }: IFingerprint,
  ): Promise<ResponseErrorDto | UserResponseDto> {
    try {
      const { jwtTokens, userData } = await this.authService.loginUser(
        authData,
        Array.isArray(fingerprint) ? fingerprint[0] : fingerprint,
      );
      this.setResponseTokens(res, jwtTokens);
      return userData;
    } catch (error: unknown) {
      return getErrorResponse(error, res);
    }
  }
}
