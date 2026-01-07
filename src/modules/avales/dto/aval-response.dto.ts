import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Estado, EtapaFlujo } from '@prisma/client';

export class EventoSimpleDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'EVT-2025-001' })
  codigo: string;

  @ApiProperty({ example: 'Campeonato Nacional de Atletismo 2025' })
  nombre: string;

  @ApiProperty({ example: '2025-12-01T08:00:00Z' })
  fechaInicio: string;

  @ApiProperty({ example: '2025-12-05T18:00:00Z' })
  fechaFin: string;

  @ApiProperty({ example: 'Quito' })
  ciudad: string;

  @ApiProperty({ example: 'Ecuador' })
  pais: string;
}

export class AvalObjetivoResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  orden: number;

  @ApiProperty({ example: 'Obtener experiencia internacional' })
  descripcion: string;
}

export class AvalCriterioResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  orden: number;

  @ApiProperty({ example: 'Rendimiento en competencias nacionales' })
  descripcion: string;
}

export class RubroResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pasajes' })
  nombre: string;
}

export class AvalRequerimientoResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '5' })
  cantidadDias: string;

  @ApiPropertyOptional({ example: '50.00' })
  valorUnitario?: string;

  @ApiProperty({ type: RubroResponseDto })
  rubro: RubroResponseDto;
}

export class DeportistaSimpleDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Juan Pérez' })
  nombre: string;

  @ApiProperty({ example: '1234567890' })
  cedula: string;
}

export class DeportistaAvalResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ATLETA' })
  rol: string;

  @ApiProperty({ type: DeportistaSimpleDto })
  deportista: DeportistaSimpleDto;
}

export class UsuarioSimpleDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Carlos Entrenador' })
  nombre: string;

  @ApiProperty({ example: 'carlos@example.com' })
  email: string;
}

export class EntrenadorAvalResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ENTRENADOR PRINCIPAL' })
  rol: string;

  @ApiProperty({ example: true })
  esPrincipal: boolean;

  @ApiProperty({ type: UsuarioSimpleDto })
  entrenador: UsuarioSimpleDto;
}

export class AvalTecnicoResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiPropertyOptional({ example: 'Descripción del aval técnico' })
  descripcion?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/archivo.pdf' })
  archivo?: string;

  @ApiProperty({ example: '2025-06-01T06:00:00Z' })
  fechaHoraSalida: string;

  @ApiProperty({ example: '2025-06-05T20:00:00Z' })
  fechaHoraRetorno: string;

  @ApiProperty({ example: 'Bus interprovincial' })
  transporteSalida: string;

  @ApiProperty({ example: 'Bus interprovincial' })
  transporteRetorno: string;

  @ApiProperty({ example: 2 })
  entrenadores: number;

  @ApiProperty({ example: 15 })
  atletas: number;

  @ApiPropertyOptional({ example: 'Observaciones adicionales' })
  observaciones?: string;

  @ApiProperty({ type: [AvalObjetivoResponseDto] })
  objetivos: AvalObjetivoResponseDto[];

  @ApiProperty({ type: [AvalCriterioResponseDto] })
  criterios: AvalCriterioResponseDto[];

  @ApiProperty({ type: [AvalRequerimientoResponseDto] })
  requerimientos: AvalRequerimientoResponseDto[];

  @ApiProperty({ type: [DeportistaAvalResponseDto] })
  deportistasAval: DeportistaAvalResponseDto[];
}

export class HistorialResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: Estado, example: 'ACEPTADO' })
  estado: Estado;

  @ApiProperty({ enum: EtapaFlujo, example: 'REVISION_DTM' })
  etapa: EtapaFlujo;

  @ApiPropertyOptional({ example: 'Aprobado por DTM' })
  comentario?: string;

  @ApiProperty({ type: UsuarioSimpleDto })
  usuario: UsuarioSimpleDto;

  @ApiProperty({ example: '2025-01-05T10:00:00Z' })
  createdAt: string;
}

export class AvalResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiPropertyOptional({ example: 'Solicitud de aval para campeonato' })
  descripcion?: string;

  @ApiProperty({ enum: Estado, example: 'SOLICITADO' })
  estado: Estado;

  @ApiPropertyOptional({ example: 'Comentario del revisor' })
  comentario?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/convocatoria.pdf' })
  convocatoriaUrl?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/dtm.pdf' })
  dtmUrl?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/pda.pdf' })
  pdaUrl?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/solicitud.pdf' })
  solicitudUrl?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/aval.pdf' })
  aval?: string;

  @ApiProperty({ type: EventoSimpleDto })
  evento: EventoSimpleDto;

  @ApiPropertyOptional({ type: AvalTecnicoResponseDto })
  avalTecnico?: AvalTecnicoResponseDto;

  @ApiProperty({ type: [EntrenadorAvalResponseDto] })
  entrenadores: EntrenadorAvalResponseDto[];

  @ApiProperty({ type: [HistorialResponseDto] })
  historial: HistorialResponseDto[];

  @ApiProperty({ example: '2025-01-05T10:00:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-01-05T15:30:00Z' })
  updatedAt: string;
}
