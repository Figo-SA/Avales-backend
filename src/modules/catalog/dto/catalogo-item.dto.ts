import { ApiProperty } from '@nestjs/swagger';

export class CatalogoItemDto {
  @ApiProperty({ example: 1, description: 'Identificador único' })
  id: number;

  @ApiProperty({ example: 'Fútbol', description: 'Nombre del ítem' })
  nombre: string;
}
