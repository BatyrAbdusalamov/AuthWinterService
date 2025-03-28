import { Controller, Get, Param, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  ResponseErrorDto,
  getErrorResponse,
} from 'src/responseData/ResponseErrorDto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('refresh/:guid')
  @ApiParam({
    name: 'guid',
    required: true,
    description: 'Уникальный идентификатор пользователя',
    type: String,
  })
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
  async refreshInToken(
    @Param('guid') guid: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseErrorDto | null> {
    try {
      
    } catch (error) {
      return getErrorResponse(error, res, 401);
    }
  }
}
