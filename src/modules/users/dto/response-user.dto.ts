import { IsInt, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';

export class ResponseUserDto extends BaseUserDto {
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
