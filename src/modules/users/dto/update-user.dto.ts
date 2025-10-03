// dto/update-user.dto.ts
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserEditableDto } from './user-editable.dto';

export class UpdateUserDto extends PartialType(UserEditableDto) {
  @ApiPropertyOptional({ example: 'newpass123', minLength: 6, maxLength: 32 })
  @IsOptional()
  @IsString()
  @Length(6, 32)
  password?: string;

  // Si permites cambiar roles en update:
  @ApiPropertyOptional({ example: [3, 7] })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  rolIds?: number[];
}
