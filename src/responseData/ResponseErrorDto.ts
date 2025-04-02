import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ErrorStatus } from 'src/types/errorStatus';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';

export class ResponseErrorDto {
  constructor(status: number, description?: string) {
    return { status, description: description ?? ErrorStatus[status] };
  }
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Error status codes',
    example: '200+ or 300+',
    type: 'number',
  })
  status: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Error text',
    example: 'Error request client',
    type: 'string',
  })
  description: string;
}

export function getErrorResponse(
  error: unknown,
  res: Response,
  statusCode = 400,
) {
  if (
    error instanceof HttpException &&
    typeof error.message === 'string' &&
    error.message
  ) {
    res.statusCode = statusCode;
    return new ResponseErrorDto(210, error.message);
  } else {
    console.error(error, ['Time: ', `${new Date().toTimeString()}`]);
    res.statusCode = 500;
    return new ResponseErrorDto(
      300,
      'Произошла ошибка, повторите попытку позже.',
    );
  }
}
