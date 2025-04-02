import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Roles as RoleModel } from 'models/roles';
import { RoleDto } from 'src/responseData/RoleDto';

interface CreatingRoleData extends RoleDto {
  name: string;
  tags: string[];
}

interface SearchRoleDataParams {
  name?: string;
  tags?: string[];
}

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleModel)
    private readonly roleRepository: typeof RoleModel,
  ) {}
  async getRoleInfoInId(id: number) {
    return await this.roleRepository.findByPk(id);
  }
  async getRolesInfoInParams(searchRoleDataParams: SearchRoleDataParams = {}) {
    if (
      Object.keys(searchRoleDataParams).length &&
      (searchRoleDataParams.name || searchRoleDataParams.tags?.length)
    ) {
      return await this.roleRepository.findAll({
        where: { ...searchRoleDataParams },
      });
    } else {
      throw new HttpException('Отсутствую данные для поиска', 400);
    }
  }
  async getAllInfoRoles() {
    return await this.roleRepository.findAll();
  }
  async createRole(roleData: CreatingRoleData) {
    const isRole = await this.roleRepository.findOne({
      where: { name: roleData.name },
    });
    if (isRole) {
      throw new HttpException('Роль с таким именем уже существует', 400);
    }
    return await this.roleRepository.create(new RoleDto(roleData));
  }
}
