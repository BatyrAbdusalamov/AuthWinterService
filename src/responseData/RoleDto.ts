import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

interface CreatingRoleData {
  name: string;
  tags: string[];
}

const NAME_REGEXP = /^[a-zA-Zа-я ]+$/;

function ValidateCreatingRoleDto({ name, tags }: CreatingRoleData) {
  if (name && tags) {
    if (!NAME_REGEXP.test(name)) throw new Error('Недопустимое название Роли');
    const errTags: string[] = [];
    tags.map((tag) => {
      if (!NAME_REGEXP.test(tag) || !tag) errTags.push(tag);
    });
    if (!errTags.length)
      throw new Error(`Недопустимые теги: ${errTags.join(', ')}`);
  } else {
    throw new Error('Название Роли и Тэги не должны быть пустыми');
  }
  return false;
}

export class RoleDto {
  constructor(roleData: CreatingRoleData) {
    ValidateCreatingRoleDto(roleData);
    this.name = roleData.name;
    this.tags = roleData.tags;
  }

  @ApiProperty({
    description: 'Имя роли',
    example: 'SuperUser',
    minLength: 4,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Zа-я ]+$/)
  @MinLength(4)
  name: string;

  @ApiProperty({
    description: 'Теги для роли',
    example: '["tag","tag2"]',
    minLength: 1,
    isArray: true,
    type: 'string',
  })
  @IsArray()
  @IsNotEmpty()
  @MinLength(1)
  tags: string[];
}
