import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendNotificationDto {
  @ApiProperty({
    description: 'Array de tokens de Expo a los que enviar la notificación',
    example: ['ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  tokens: string[];

  @ApiProperty({
    description: 'Título de la notificación',
    example: 'Nuevo Evento Disponible',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Cuerpo del mensaje de la notificación',
    example: 'Se ha creado un nuevo evento disponible para solicitar aval',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'Datos adicionales opcionales para la notificación',
    example: { eventoId: 1, tipo: 'nuevo-evento' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}
