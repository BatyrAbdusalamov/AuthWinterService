import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiCookieAuth,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto, UserResponseDto } from '../../responseData/UserDto';
import {
  getErrorResponse,
  ResponseErrorDto,
} from 'src/responseData/ResponseErrorDto';
import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { Tags } from 'src/utils/Tags.decorator';
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

interface SearchUserDataParams {
  login?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @UseGuards(AuthGuard)
  @Tags('User')
  @Get('info/:guid')
  @ApiCookieAuth('access-token')
  @ApiParam({
    name: 'guid',
    required: true,
    description: 'Уникальный идентификатор пользователя',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Успешно',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Не корректые данные для поиска',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Cессия истекла',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Отсутствуют права доступа',
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
  ): Promise<ResponseErrorDto | UserResponseDto> {
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
      const userRole = await this.roleService.getRoleInfoInId(findUser.role);
      return new UserResponseDto({
        ...(JSON.parse(JSON.stringify(findUser)) as UserDto),
        role: userRole?.name ?? 'неизвестно',
        tags: userRole?.tags ?? [],
      });
    } catch (error) {
      return getErrorResponse(error, res);
    }
  }

  @UseGuards(AuthGuard)
  @Tags('User')
  @Patch('info')
  @ApiCookieAuth('access-token')
  @ApiBody({
    required: true,
    description: 'Данные для поиска пользователей(Все поля опциональные)',
    type: UserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Успешно',
    type: UserResponseDto,
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
    status: 401,
    description: 'Cессия истекла',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Отсутствуют права доступа',
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

  @UseGuards(AuthGuard)
  @Tags('Admin')
  @Post('create')
  @ApiCookieAuth('access-token')
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
    status: 401,
    description: 'Cессия истекла',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Отсутствуют права доступа',
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
