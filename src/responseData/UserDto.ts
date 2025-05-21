import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

interface CreatingUserData {
  name: string;
  phone_number: string;
  date_of_birth: string;
  password: string;
}

interface ResponseUserData {
  name: string;
  phone_number: string;
  date_of_birth: string;
  password: string;
  role?: string;
  size?: string;
}

const PHONE_REGEXP = /^\+[0-9]\d{1,14}$/;

function ValidateCreatingUserDto({
  name,
  phone_number,
  password,
  date_of_birth,
}: CreatingUserData) {
  if (name && date_of_birth && phone_number && password) {
    if (name.length < 4) throw new HttpException('Name меньше 4 символов', 400);
    if (!(PHONE_REGEXP.test(phone_number) && phone_number.length > 7))
      throw new HttpException('Номер телефона является не допустимым', 400);
    if (password.length < 7)
      throw new HttpException('Пароль меньше 7 символов', 400);
  } else {
    throw new HttpException('Не все поля заполнены', 400);
  }
  return false;
}

export class UserDto {
  constructor(userData: CreatingUserData, hashedPassword: () => string) {
    ValidateCreatingUserDto(userData);
    this.name = userData.name;
    this.phone_number = userData.phone_number;
    this.date_of_birth = userData.date_of_birth;
    this.password = hashedPassword();
    this.role = 2;
    this.size = '';
  }

  @ApiProperty({
    description: 'Размер одежды клиента',
    type: 'string',
  })
  size?: string;

  @ApiProperty({
    description: 'ФИО клиента',
    example: 'Doe',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Дата рождения клиента',
    example: '32.13.2125',
    type: 'string',
  })
  date_of_birth: string;

  @ApiProperty({
    description: 'Номер телефона клиента в международном формате',
    example: '+123123123123',
    type: 'string',
  })
  phone_number: string;

  @ApiProperty({
    description: 'Пароль клиента (минимум 7 символов)',
    example: 'password123',
    type: 'string',
    minLength: 7,
  })
  password: string;

  @ApiProperty({
    description: 'Id роли',
    example: '1',
    type: 'number',
  })
  role: number;
}

export class UserResponseDto {
  constructor(userData: ResponseUserData) {
    this.name = userData.name;
    this.phone_number = userData.phone_number;
    this.date_of_birth = userData.date_of_birth;
    this.size = userData.size;
    this.role = Number(userData?.role) || 0;
  }

  @ApiProperty({
    description: 'ФИО клиента',
    example: 'Doe',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Дата рождения клиента',
    example: '32.13.2125',
    type: 'string',
  })
  date_of_birth: string;

  @ApiProperty({
    description: 'Номер телефона клиента в международном формате',
    example: '+123123123123',
    type: 'string',
  })
  phone_number: string;

  @ApiProperty({
    description: 'Пароль клиента (минимум 7 символов)',
    example: 'password123',
    type: 'string',
    minLength: 7,
  })
  password: string;

  @ApiProperty({
    description: 'Id роли',
    example: '1',
    type: 'number',
  })
  role: number;

  @ApiProperty({
    description: 'Размер одежды',
    type: 'string',
  })
  size?: string;
}
