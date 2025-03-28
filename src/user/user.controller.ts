import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../responseData/UserDto';
import {
  getErrorResponse,
  ResponseErrorDto,
} from 'src/responseData/ResponseErrorDto';
import { Response } from 'express';

interface CreatingUserData extends UserDto {
  login: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  photo?: string;
}

interface SearchUserDataParams {
  login?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('info/:guid')
  @ApiParam({
    name: 'guid',
    required: true,
    description: 'Уникальный идентификатор пользователя',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Успешно',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Не корректые данные для поиска',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервиса',
    type: ResponseErrorDto,
  })
  async getUserInfoInGuid(
    @Param('guid') guid: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseErrorDto | UserDto> {
    if (!guid) {
      res.statusCode = 400;
      return Promise.resolve(
        new ResponseErrorDto(210, 'Не корректые данные для поиска'),
      );
    }
    try {
      const findUser = await this.userService.getUserInfoInGuid(guid);

      if (!findUser) {
        res.statusCode = 404;
        return new ResponseErrorDto(110, 'Пользователь не найден');
      }
      return findUser;
    } catch (error) {
      return getErrorResponse(error, res);
    }
  }

  @Post('info')
  @ApiBody({
    required: true,
    description: 'Данные для поиска пользователей(Все поля опциональные)',
    type: UserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Успешно',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Не корректые данные для поиска',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервиса',
    type: ResponseErrorDto,
  })
  async getUsersInfoInParams(
    @Body() searchUserDataParams: SearchUserDataParams,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseErrorDto | UserDto[]> {
    try {
      const findUser =
        await this.userService.getUsersInfoInParams(searchUserDataParams);

      if (!findUser) {
        res.statusCode = 404;
        return new ResponseErrorDto(110, 'Пользователь не найден');
      }
      return findUser;
    } catch (error) {
      return getErrorResponse(error, res);
    }
  }

  @Post('create')
  @ApiBody({
    required: true,
    description: 'Данные для регистрации',
    type: UserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Пользователь зарегистрирован успешно',
    type: undefined,
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
  async createUser(
    @Body() userData: CreatingUserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseErrorDto | null> {
    try {
      await this.userService.createUser(userData);
      res.statusCode = 201;
      return null;
    } catch (error: unknown) {
      return getErrorResponse(error, res);
    }
  }
}
