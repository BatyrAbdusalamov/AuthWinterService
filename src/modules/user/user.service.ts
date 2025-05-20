import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users as UserModel } from '../../../models/users';
import { UserDto } from 'src/responseData/UserDto';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { AuthRegDto } from 'src/requestData/AuthDto';
import { Coach } from 'models/couches';

interface SearchUserDataParams {
  phone_number?: string;
  name?: string;
  size?: string;
  role?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userRepository: typeof UserModel,
    @InjectModel(Coach)
    private readonly coachRepository: typeof Coach,
  ) {}

  private async hashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  async verifyPassword(
    plainTextPassword: string,
    userSearchData: SearchUserDataParams,
  ): Promise<UserDto> {
    const clientData = await this.userRepository.findOne({
      where: { ...userSearchData },
    });
    const coachData = await this.coachRepository.findOne({
      where: { ...userSearchData },
    });
    const userData = clientData?.password ? clientData : coachData;
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

  async getUserInfoInPhone(phone_number: string, attributes?: string[]) {
    return await this.userRepository.findOne({
      where: { phone_number },
      attributes: attributes ?? [
        'name',
        'phone_number',
        'date_of_birth',
        'size',
        'role',
      ],
    });
  }

  async getUsersInfoInParams(searchUserDataParams: SearchUserDataParams = {}) {
    if (Object.keys(searchUserDataParams).length) {
      return await this.userRepository.findAll({
        where: { ...searchUserDataParams },
        attributes: ['name', 'phone_number', 'date_of_birth', 'size', 'role'],
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
            phone_number: userRegData.phone_number,
          },
        ],
      },
      attributes: ['phone_number'],
    });
    if (isUser && userRegData) {
      const errParamsMessage: string[] = [];
      if (isUser.phone_number === userRegData.phone_number) {
        errParamsMessage.push('Номер телефона');
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

  async getAllUserInfoInGuid(ids: string[]) {
    return await this.userRepository.findAll({
      where: { id: ids },
      attributes: ['name', 'phone_number', 'date_of_birth', 'size', 'role'],
    });
  }
}
