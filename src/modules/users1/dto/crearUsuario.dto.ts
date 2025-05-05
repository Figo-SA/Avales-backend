import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsInt,
  Min,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseUsuarioDto } from './baseUsuario.dto';

export class CreateUsuarioDto extends BaseUsuarioDto {
  @ApiProperty({
    description: 'Contraseña del usuario (6-32 caracteres)',
    example: 'password123',
  })
  @IsString()
  @Length(6, 32)
  password: string;

  @ApiProperty({
    description: 'Lista de IDs de roles asignados al usuario (al menos uno)',
    example: [3, 7],
  })
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @IsNotEmpty()
  rol_ids: number[];
}
