import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { REQ_RES_COOKIE } from 'src/constant/cookieConst';
import { AuthService } from 'src/modules/auth/auth.service';
import { ResponseErrorDto } from 'src/responseData/ResponseErrorDto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    private reflector: Reflector,
  ) {}

  async permissionUserRole(token: string, context: ExecutionContext) {
    const isPermission = (await this.authService.parseAccessToken(
      token,
      this.reflector.get<string[]>('roles', context.getHandler()),
    )) as boolean;
    if (isPermission) {
      return true;
    } else {
      throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const accessToken = request.cookies?.[REQ_RES_COOKIE.ACCESS] as
        | string
        | string[];

      return this.permissionUserRole(
        Array.isArray(accessToken) ? accessToken[0] : accessToken,
        context,
      );
    } catch (error) {
      const response: Response = context.switchToHttp().getResponse();
      if (error instanceof HttpException) {
        response.statusCode = error.getStatus();
        response.send(new ResponseErrorDto(240, error.message));
        return false;
      }
      console.error(error, ['Time: ', `${new Date().toTimeString()}`]);
      response.statusCode = 400;
      response.send(new ResponseErrorDto(220));
      return false;
    }
  }
}
