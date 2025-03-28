import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { v5 as uuidv5 } from 'uuid';

interface CreatingUserData extends UserDto {
  login: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  photo?: string;
}

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
    if (login.length < 4) throw new Error('Логин меньше 4 символов');
    if (!EMAIL_REGEXP.test(email))
      throw new Error('Email является не допустимым');
    if (!(PHONE_REGEXP.test(phone) && phone.length > 7))
      throw new Error('Номер телефона является не допустимым');
    if (!NAME_REGEXP.test(first_name) && !NAME_REGEXP.test(last_name))
      throw new Error('Имя или Фамилия являются не допустимыми');
    if (password.length < 7) throw new Error('Пароль меньше 7 символов');
    if (photo && URL_REGEXP.test(photo))
      throw new Error('Не корректный формат Фото');
  } else {
    throw new Error('Не все поля заполнены');
  }
  return false;
}

function GenerateGuid({ login, email }: CreatingUserData) {
  return uuidv5(login + email + Date.now(), UUIDV5_NAMESPACE);
}

export class UserDto {
  constructor(
    userData: CreatingUserData,
    hashedPassword: (pass: string) => string,
  ) {
    ValidateCreatingUserDto(userData);
    this.email = userData.email;
    this.login = userData.login;
    this.phone = userData.phone;
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.password = hashedPassword(userData.password);
    this.photo = userData.photo ?? '';
    this.guid = GenerateGuid(userData);
    this.role = 1;
    this.updated_password = Date.now();
  }

  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  guid: string;

  @ApiProperty({
    description: 'Логин пользователя (минимум 4 символа).',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  login: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Номер телефона пользователя в международном формате',
    example: '+123123123123',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[0-9]\d{1,14}$/)
  phone: string;

  @ApiProperty({
    description: 'Пароль пользователя (минимум 7 символов)',
    example: 'password123',
    minLength: 7,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @ApiProperty({
    description: 'URL фотографии пользователя',
    example: 'https://example.com/photos/user.jpg',
  })
  @IsString()
  @IsNotEmpty()
  photo?: string;

  @IsNumber()
  @IsNotEmpty()
  role: number;

  updated_password?: number;
}
