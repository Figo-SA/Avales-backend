import { ApiProperty } from '@nestjs/swagger';
import { CatalogoItemDto } from './catalogo-item.dto';

export class CatalogoDto {
  @ApiProperty({ type: [CatalogoItemDto] })
  categorias: CatalogoItemDto[];

  @ApiProperty({ type: [CatalogoItemDto] })
  disciplinas: CatalogoItemDto[];
}
