import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  getErrorResponse,
  ResponseErrorDto,
} from 'src/responseData/ResponseErrorDto';
import { RoleService } from './role.service';
import { RoleDto } from 'src/responseData/RoleDto';
import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/utils/Roles.decorator';

@Controller('role')
@ApiTags('Role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @UseGuards(AuthGuard)
  @Get('info/:id')
  @ApiCookieAuth('access-token')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Уникальный идентификатор Роли',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Успешно',
    type: RoleDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Не корректые данные',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Роль не найдена',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервиса',
    type: ResponseErrorDto,
  })
  async getRoleInfoInId(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseErrorDto | RoleDto> {
    if (!id) {
      res.statusCode = 400;
      return Promise.resolve(new ResponseErrorDto(210, 'Не корректые данные'));
    }
    try {
      const findRole = await this.roleService.getRoleInfoInId(id);

      if (!findRole) {
        res.statusCode = 404;
        return new ResponseErrorDto(110, 'Роль не найдена');
      }
      return findRole;
    } catch (error) {
      return getErrorResponse(error, res);
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('0', '2')
  @Post('create')
  @ApiCookieAuth('access-token')
  @ApiBody({
    required: true,
    description: 'Данные для создания роли',
    type: RoleDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Роль создана',
    type: undefined,
  })
  @ApiResponse({
    status: 400,
    description: 'Не корректые данные или Роль уже существует',
    type: ResponseErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервиса',
    type: ResponseErrorDto,
  })
  async createRole(
    @Body() roleData: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseErrorDto | null> {
    try {
      await this.roleService.createRole(roleData as RoleDto);
      res.statusCode = 201;
      return null;
    } catch (error) {
      return getErrorResponse(error, res);
    }
  }
}
