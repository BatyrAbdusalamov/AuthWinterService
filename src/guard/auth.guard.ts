import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IFingerprint } from 'nestjs-fingerprint';
import generateFingerprint from 'nestjs-fingerprint/dist/core/generateFingerprint';
import { Observable } from 'rxjs';
import { FINGERPRINT_PARAMS } from 'src/constant/authConst';
import { REQ_RES_COOKIE } from 'src/constant/cookieConst';
import { AuthService } from 'src/modules/auth/auth.service';
import { ResponseErrorDto } from 'src/responseData/ResponseErrorDto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  setResponseSessionHasExpired(res: Response) {
    res.statusCode = 401;
    res.send(
      new ResponseErrorDto(200, 'Сессия истекла. Пожалуйста войдите снова'),
    );

    return false;
  }

  async validateAccessToken(token: string, fingerprint: string, res: Response) {
    if (!token || !fingerprint) {
      return this.setResponseSessionHasExpired(res);
    }

    const isValidToken = await this.authService.validAccessToken(
      token,
      fingerprint,
    );

    if (!isValidToken) {
      return this.setResponseSessionHasExpired(res);
    }

    return isValidToken;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const response: Response = context.switchToHttp().getResponse();
      const accessToken = request.cookies?.[REQ_RES_COOKIE.ACCESS] as
        | string
        | string[];
      const { id: fingerprint } = generateFingerprint(
        request,
        FINGERPRINT_PARAMS,
      ) as IFingerprint;
      return this.validateAccessToken(
        Array.isArray(accessToken) ? accessToken[0] : accessToken,
        fingerprint,
        response,
      );
    } catch (error) {
      console.error(error, ['Time: ', `${new Date().toTimeString()}`]);
      const response: Response = context.switchToHttp().getResponse();
      response.statusCode = 500;
      response.send(new ResponseErrorDto(230));
      return false;
    }
  }
}
