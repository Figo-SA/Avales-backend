import { ApiProperty } from '@nestjs/swagger';

export class DeletedResourceDto {
  @ApiProperty({
    description: 'Identificador del recurso eliminado',
    example: 123,
  })
  id: number;
}
