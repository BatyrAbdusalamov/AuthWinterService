import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users as UserModel } from '../../../models/users';
import { UserDto } from 'src/responseData/UserDto';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { AuthRegDto } from 'src/requestData/AuthDto';

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
  async verifyPassword(
    plainTextPassword: string,
    userSearchData: SearchUserDataParams,
  ): Promise<UserDto> {
    const userData = await this.userRepository.findOne({
      where: { ...userSearchData },
    });
    if (!userData?.password) {
      throw new HttpException('Пользователь не найден', 400);
    }
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      userData.password,
    );
    if (!isPasswordMatching) {
      throw new HttpException('Пароль не действительный', 400);
    }
    return userData;
  }

  async getUserInfoInGuid(guid: string, attributes?: string[]) {
    return await this.userRepository.findOne({
      where: { guid },
      attributes: attributes ?? [
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
      });
    } else {
      throw new HttpException('Отсутствуют данные для поиска', 400);
    }
  }

  async createUser(userRegData: AuthRegDto) {
    //Проверка на наличие существующего пользователя с таким же логином или Email
    const isUser = await this.userRepository.findOne({
      where: {
        [Op.or]: [
          {
            login: userRegData.login,
          },
          {
            email: userRegData.email,
          },
        ],
      },
      attributes: ['login', 'email'],
    });
    if (isUser && userRegData) {
      const errParamsMessage: string[] = [];
      if (isUser.login === userRegData.login) {
        errParamsMessage.push('Логин');
      }
      if (isUser.email === userRegData.email) {
        errParamsMessage.push('Email');
      }
      throw new HttpException(
        errParamsMessage.length
          ? `Пользователь с таким ${errParamsMessage.length > 1 ? errParamsMessage.join(' и ') : errParamsMessage[0]} уже существует.`
          : 'Пользователь уже существует.',
        400,
      );
    }
    const hashPassword = await this.hashedPassword(userRegData.password); //Может быть ошибка хеширования bcrypt, обязательно нужно обработать выше
    const userData = await this.userRepository.create(
      new UserDto(userRegData, () => hashPassword),
    );
    return userData;
  }
}
