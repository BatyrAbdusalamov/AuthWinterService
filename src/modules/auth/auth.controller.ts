import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleService } from '../role/role.service';

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
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
  ) {}

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
    status: 400,
    description: 'Пользователь не найден',
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
      this.setResponseTokens(
        res,
        jwtTokens,
        cookies?.Expires ? new Date(cookies?.Expires) : undefined,
      );
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
      const userRole = await this.roleService.getRoleInfoInId(user.role);
      return new UserResponseDto({
        ...(JSON.parse(JSON.stringify(user)) as UserDto),
        role: userRole?.name ?? 'неизвестно',
        tags: userRole?.tags ?? [],
      });
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
      const userRole = await this.roleService.getRoleInfoInId(userData.role);
      return new UserResponseDto({
        ...(JSON.parse(JSON.stringify(userData)) as UserDto),
        role: userRole?.name ?? 'неизвестно',
        tags: userRole?.tags ?? [],
      });
    } catch (error: unknown) {
      return getErrorResponse(error, res);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Данные о авторизованом пользователе',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Токен устарел или отсутствует',
    type: ResponseErrorDto,
  })
  @Get('verify')
  async verify(
    @Res({ passthrough: true }) res: Response,
    @Req() { cookies }: Request,
    @Fingerprint() { id: fingerprint }: IFingerprint,
  ) {
    try {
      const accessToken = cookies?.[REQ_RES_COOKIE.ACCESS] as string | string[];
      const userData = (await this.authService.validAccessToken(
        Array.isArray(accessToken) ? accessToken[0] : accessToken,
        fingerprint,
        true,
      )) as UserDto;
      if (!userData) {
        res.statusCode = 401;
        return new ResponseErrorDto(
          200,
          'Сессия истекла. Пожалуйста войдите снова',
        );
      }
      res.statusCode = 201;
      const userRole = await this.roleService.getRoleInfoInId(userData.role);
      return new UserResponseDto({
        ...(JSON.parse(JSON.stringify(userData)) as UserDto),
        role: userRole?.name ?? 'неизвестно',
        tags: userRole?.tags ?? [],
      });
    } catch (error: unknown) {
      return getErrorResponse(error, res);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Доступ разрешен',
  })
  @ApiResponse({
    status: 401,
    description: 'Токен устарел или отсутствует',
    type: ResponseErrorDto,
  })
  @UseGuards(AuthGuard)
  @Get()
  validate() {
    return `OK`;
  }

  @Get('logout')
  @ApiResponse({
    status: 200,
    description: 'Пользователь разлогинен',
    type: undefined,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервиса',
    type: ResponseErrorDto,
  })
  logout(@Res({ passthrough: true }) res: Response): ResponseErrorDto | null {
    try {
      res.cookie(REQ_RES_COOKIE.REFRESH, '', {
        expires: new Date(1),
      });
      res.cookie(REQ_RES_COOKIE.ACCESS, '', {
        expires: new Date(1),
      });
      return null;
    } catch (error: unknown) {
      return getErrorResponse(error, res);
    }
  }
}
