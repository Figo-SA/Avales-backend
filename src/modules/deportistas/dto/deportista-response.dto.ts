import { ApiProperty } from '@nestjs/swagger';

export class DeportistaResponseDto {
  @ApiProperty({ example: 1, description: 'ID del deportista' })
  id: number;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  nombre: string;

  @ApiProperty({ example: 'Fútbol', description: 'Disciplina deportiva' })
  disciplina: string;

  @ApiProperty({ example: 'A', description: 'Categoría del deportista' })
  categoria: string;
}
