import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users as UserModel } from '../../models/users';
import { Roles as RoleModel } from '../../models/roles';
import { UserDto } from 'src/responseData/UserDto';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';

interface SearchUserDataParams {
  login?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userRepository: typeof UserModel,
  ) {}

  private async hashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new Error('Пароль не действительный');
    }
  }

  async getUserInfoInGuid(guid: string) {
    return await this.userRepository.findOne({
      where: { guid },
      attributes: [
        'guid',
        'login',
        'email',
        'first_name',
        'last_name',
        'phone',
        'photo',
        'role',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: RoleModel,
          attributes: ['id', 'tags'],
          through: { attributes: [] },
        },
      ],
    });
  }

  async getUsersInfoInParams(searchUserDataParams: SearchUserDataParams = {}) {
    if (Object.keys(searchUserDataParams).length) {
      return await this.userRepository.findAll({
        where: { ...searchUserDataParams },
        attributes: [
          'guid',
          'login',
          'email',
          'first_name',
          'last_name',
          'phone',
          'photo',
          'role',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: RoleModel,
            attributes: ['id', 'nameTag'],
            through: { attributes: [] },
          },
        ],
      });
    } else {
      throw new Error('Отсутствую данные для поиска');
    }
  }

  async createUser(userData: UserDto) {
    //Проверка на наличие существующего пользователя с таким же логином или Email
    const isUser = await this.userRepository.findOne({
      where: {
        [Op.or]: [
          {
            login: userData.login,
          },
          {
            email: userData.email,
          },
        ],
      },
      attributes: ['login', 'email'],
    });
    if (isUser && userData) {
      const errParamsMessage: string[] = [];
      if (isUser.login === userData.login) {
        errParamsMessage.push('Логин');
      }
      if (isUser.email === userData.email) {
        errParamsMessage.push('Email');
      }
      throw new Error(
        `Пользователь с таким ${errParamsMessage.length > 1 ? errParamsMessage.join(' и ') : errParamsMessage[0]} уже существует.`,
      );
    }
    const hashPassword = await this.hashedPassword(userData.password); //Может быть ошибка хеширования bcrypt, обязательно нужно обработать выше
    await this.userRepository.create(new UserDto(userData, () => hashPassword));
    return true;
  }
}
