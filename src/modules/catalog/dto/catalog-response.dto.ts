import { ApiProperty } from '@nestjs/swagger';
import { CatalogItemDto } from './catalog-item.dto';

/**
 * DTO de respuesta para el catálogo completo
 */
export class CatalogResponseDto {
  @ApiProperty({
    type: [CatalogItemDto],
    description: 'Lista de categorías',
  })
  categorias: CatalogItemDto[];

  @ApiProperty({
    type: [CatalogItemDto],
    description: 'Lista de disciplinas',
  })
  disciplinas: CatalogItemDto[];
}