import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

interface LoginUserData {
  phone_number: string;
  password: string;
}

interface CreatingUserData {
  name: string;
  date_of_birth: string;
  phone_number: string;
  password: string;
}

export class AuthLoginDto implements LoginUserData {
  constructor(phone_number: string, password: string) {
    this.phone_number = phone_number;
    this.password = password;
  }

  @ApiProperty({
    description: 'Телефон клиента',
    example: '+79892345894',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  phone_number: string;

  @ApiProperty({
    description: 'Пароль клиента',
    example: 'Asdf123456',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}

export class AuthRegDto implements CreatingUserData {
  @ApiProperty({
    description: 'ФИО клиента',
    example: 'Doe',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Дата рождения клиента',
    example: '2023-10-01 14:30:00',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  date_of_birth: string;

  @ApiProperty({
    description: 'Номер телефона клиента в международном формате',
    example: '+123123123123',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[0-9]\d{1,14}$/)
  phone_number: string;

  @ApiProperty({
    description: 'Пароль клиента (минимум 7 символов)',
    example: 'password123',
    type: 'string',
    minLength: 7,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
