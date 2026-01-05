import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para un ítem de catálogo (categoría o disciplina)
 */
export class CatalogItemDto {
  @ApiProperty({ example: 1, description: 'Identificador único' })
  id: number;

  @ApiProperty({ example: 'Fútbol', description: 'Nombre del ítem' })
  nombre: string;
}