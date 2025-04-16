import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

interface LoginUserData {
  login: string;
  password: string;
}

interface CreatingUserData {
  login: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  photo?: string;
}

export class AuthLoginDto implements LoginUserData {
  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
  }

  @ApiProperty({
    description: 'Login пользователя',
    example: 'vany221',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  login: string;

  @ApiProperty({
    description: 'Пароль пользователя',
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
    description: 'Login пользователя',
    example: 'vany221',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  login: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'John',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Doe',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'john.doe@example.com',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Номер телефона пользователя в международном формате',
    example: '+123123123123',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[0-9]\d{1,14}$/)
  phone: string;

  @ApiProperty({
    description: 'Пароль пользователя (минимум 7 символов)',
    example: 'password123',
    type: 'string',
    minLength: 7,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @ApiProperty({
    description:
      'Фотография формата Blob преобразованная в String, закодированная Base64',
    example: 'http://example.com/file/test.jpg',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  photo?: string;
}
