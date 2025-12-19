// dto/update-user.dto.ts
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  IsArray,
  IsEnum,
} from 'class-validator';
import { TipoRol } from '@prisma/client';
import { UserEditableDto } from './user-editable.dto';

export class UpdateUserDto extends PartialType(UserEditableDto) {
  @ApiPropertyOptional({ example: 'newpass123', minLength: 6, maxLength: 32 })
  @IsOptional()
  @IsString()
  @Length(6, 32)
  password?: string;

  // Si permites cambiar roles en update:
  @ApiPropertyOptional({
    example: [TipoRol.ADMIN, TipoRol.SECRETARIA],
    isArray: true,
    enum: TipoRol,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TipoRol, { each: true })
  roles?: TipoRol[];
}
