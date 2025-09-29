import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, Min } from 'class-validator';

export class PaginationMetaDto {
  @ApiPropertyOptional({ example: 125 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  total: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 13 })
  @IsInt()
  @Min(1)
  lastPage: number;

  @ApiPropertyOptional({ example: true })
  @Type(() => Boolean)
  @IsBoolean()
  hasNext: boolean;

  @ApiPropertyOptional({ example: false })
  @Type(() => Boolean)
  @IsBoolean()
  hasPrev: boolean;
}
