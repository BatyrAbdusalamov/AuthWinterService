import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { v5 as uuidv5 } from 'uuid';
import { RoleDto } from './RoleDto';

interface CreatingUserData {
  login: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  photo?: string;
}

interface ResponseUserData {
  guid: string;
  login: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photo?: string;
  role?: string;
  tags?: string[];
  updated_password?: string;
}

const DEFAULT_USER_ICON_PHOTO =
  'https://avatars.mds.yandex.net/i?id=60f336ebdb8134776558e8638b81d111_sr-5538185-images-thumbs&n=13';

const UUIDV5_NAMESPACE = 'ccd3616d-c275-4a9f-909d-48ea6d441172';

const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const PHONE_REGEXP = /^\+[0-9]\d{1,14}$/;
const NAME_REGEXP = /^[a-zA-Zа-яА-Я ]+$/;
const URL_REGEXP = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/;

function ValidateCreatingUserDto({
  login,
  first_name,
  last_name,
  email,
  phone,
  password,
  photo,
}: CreatingUserData) {
  if (login && first_name && last_name && email && phone && password) {
    if (login.length < 4)
      throw new HttpException('Логин меньше 4 символов', 400);
    if (!EMAIL_REGEXP.test(email))
      throw new HttpException('Email является не допустимым', 400);
    if (!(PHONE_REGEXP.test(phone) && phone.length > 7))
      throw new HttpException('Номер телефона является не допустимым', 400);
    if (!NAME_REGEXP.test(first_name) && !NAME_REGEXP.test(last_name))
      throw new HttpException('Имя или Фамилия являются не допустимыми', 400);
    if (password.length < 7)
      throw new HttpException('Пароль меньше 7 символов', 400);
    if (photo && URL_REGEXP.test(photo))
      throw new HttpException('Не корректный формат Фото', 400);
  } else {
    throw new HttpException('Не все поля заполнены', 400);
  }
  return false;
}

function GenerateGuid({ login, email }: CreatingUserData) {
  return uuidv5(login + email + Date.now(), UUIDV5_NAMESPACE);
}

export class UserDto {
  constructor(userData: CreatingUserData, hashedPassword: () => string) {
    ValidateCreatingUserDto(userData);
    this.email = userData.email;
    this.login = userData.login;
    this.phone = userData.phone;
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.password = hashedPassword();
    this.photo = userData.photo ?? '';
    this.guid = GenerateGuid(userData);
    this.role = 1;
    this.updated_password = String(Date.now());
  }

  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  guid: string;

  @ApiProperty({
    description: 'Логин пользователя (минимум 4 символа).',
    example: 'johndoe',
    type: 'string',
    minLength: 4,
  })
  login: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'John',
    type: 'string',
  })
  first_name: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Doe',
    type: 'string',
  })
  last_name: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'john.doe@example.com',
    type: 'string',
  })
  email: string;

  @ApiProperty({
    description: 'Номер телефона пользователя в международном формате',
    example: '+123123123123',
    type: 'string',
  })
  phone: string;

  @ApiProperty({
    description: 'Пароль пользователя (минимум 7 символов)',
    example: 'password123',
    type: 'string',
    minLength: 7,
  })
  password: string;

  @ApiProperty({
    description: 'URL фотографии пользователя',
    example: 'https://example.com/photos/user.jpg',
    type: 'string',
    required: false,
  })
  photo?: string;

  @ApiProperty({
    description: 'Id роли',
    example: '1',
    type: 'number',
  })
  role: number;

  @ApiProperty({
    description: 'Дата последнего обновления пароля',
    example: '01.01.1970',
    type: 'string',
  })
  updated_password?: string;
}

export class UserResponseDto {
  constructor(userData: ResponseUserData) {
    this.email = userData.email;
    this.login = userData.login;
    this.phone = userData.phone;
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.photo = userData.photo ?? DEFAULT_USER_ICON_PHOTO;
    this.guid = userData.guid;
    this.role = userData?.role;
    this.tags = userData?.tags;
    this.updated_password = userData.updated_password;
  }

  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  guid: string;

  @ApiProperty({
    description: 'Логин пользователя (минимум 4 символа).',
    example: 'johndoe',
    type: 'string',
    minLength: 4,
  })
  login: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'John',
    type: 'string',
  })
  first_name: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Doe',
    type: 'string',
  })
  last_name: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'john.doe@example.com',
    type: 'string',
  })
  email: string;

  @ApiProperty({
    description: 'Номер телефона пользователя в международном формате',
    example: '+123123123123',
    type: 'string',
  })
  phone: string;

  @ApiProperty({
    description: 'URL фотографии пользователя',
    example: 'https://example.com/photos/user.jpg',
    type: 'string',
    required: false,
  })
  photo?: string;

  @ApiProperty({
    description: 'Роль',
    example: 'SupeUser',
    type: 'string',
  })
  role?: string;

  @ApiProperty({
    description: 'Теги роли',
    example: `["SuperUser", "SuperPuperUser, "ВластелинТегов"]`,
    type: RoleDto,
  })
  tags?: string[];

  @ApiProperty({
    description: 'Дата последнего обновления пароля',
    example: '01.01.1970',
    type: 'string',
  })
  updated_password?: string;
}
