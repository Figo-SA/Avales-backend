import { IsInt, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BaseUsuarioDto } from './baseUsuario.dto';

export class UsuariosResponseDto extends BaseUsuarioDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Lista de IDs de roles asignados al usuario',
    example: [3, 7],
  })
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  rol_ids: number[];
}

// export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
