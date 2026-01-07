import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponsePaginated,
} from 'src/common/swagger/decorators/api-success-responses.decorator';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';
import { AvalResponseDto, HistorialResponseDto } from '../dto/aval-response.dto';

/**
 * Decorador para el endpoint de listado de avales (paginado y filtrable)
 */
export function ApiGetAvales() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar avales (filtrable y paginado)',
      description: `
Retorna una lista paginada de avales (colecciones de documentos) con filtros opcionales.

Parámetros de paginación:
- page: Número de página (default: 1)
- limit: Cantidad de registros por página (default: 50)

Filtros disponibles:
- estado: Filtrar por estado (DISPONIBLE/SOLICITADO/RECHAZADO/ACEPTADO)
- etapa: Filtrar por etapa del flujo (SOLICITUD/REVISION_DTM/PDA/CONTROL_PREVIO/SECRETARIA/FINANCIERO)
- eventoId: Filtrar por ID del evento
- search: Buscar por nombre o código del evento
      `.trim(),
    }),
    SuccessMessage('Avales obtenidos exitosamente'),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Página (default: 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Resultados por página (default: 50)',
    }),
    ApiQuery({
      name: 'estado',
      required: false,
      description: 'Filtrar por estado',
    }),
    ApiQuery({
      name: 'etapa',
      required: false,
      description: 'Filtrar por etapa del flujo',
    }),
    ApiQuery({
      name: 'eventoId',
      required: false,
      type: Number,
      description: 'Filtrar por ID del evento',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Buscar por nombre o código del evento',
    }),
    ApiOkResponsePaginated(
      AvalResponseDto,
      undefined,
      'Avales obtenidos exitosamente',
    ),
    ApiErrorResponsesConfig([401, 403, 500]),
  );
}

/**
 * Decorador para el endpoint de obtener aval por ID
 */
export function ApiGetAval() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener aval por ID',
      description: `
Retorna el detalle completo de un aval incluyendo:
- Información del evento asociado
- Aval técnico con objetivos, criterios y requerimientos
- Deportistas y entrenadores participantes
- Historial completo de cambios de estado
      `.trim(),
    }),
    SuccessMessage('Aval obtenido exitosamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del aval' }),
    ApiOkResponseData(AvalResponseDto, undefined, 'Aval obtenido exitosamente'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un aval con ese ID',
        instance: '/api/v1/avales/{id}',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de subir convocatoria (Paso 1)
 */
export function ApiUploadConvocatoria() {
  return applyDecorators(
    ApiOperation({
      summary: 'Subir convocatoria y crear colección de aval (Paso 1)',
      description: `
Primer paso para crear un aval: Sube la convocatoria del evento y crea la ColeccionAval.

Este endpoint:
1. Valida que el evento exista y esté DISPONIBLE
2. Valida que no exista un aval previo para el evento
3. Sube el archivo de convocatoria al storage
4. Crea la ColeccionAval con el archivo de convocatoria
5. Retorna el ID de la colección para usarlo en el paso 2

Una vez creada la colección, el entrenador puede proceder a crear el AvalTecnico (solicitud).

Validaciones:
- Archivo de convocatoria requerido
- Tamaño máximo: 5MB
- Acepta cualquier formato de archivo
      `.trim(),
    }),
    SuccessMessage('Convocatoria subida y colección de aval creada exitosamente'),
    ApiCreatedResponseData(AvalResponseDto, undefined, 'Convocatoria subida exitosamente'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 409, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'Evento no encontrado',
        instance: '/api/v1/avales/convocatoria',
      },
      409: {
        type: 'https://api.tu-dominio.com/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: 'El evento ya tiene un aval creado',
        instance: '/api/v1/avales/convocatoria',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de crear aval técnico (Paso 2)
 */
export function ApiCreateAval() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear solicitud de aval técnico (Paso 2)',
      description: `
Segundo paso para crear un aval: Crea el AvalTecnico asociado a una ColeccionAval existente.

El entrenador debe proporcionar:
- ID de la ColeccionAval creada en el paso 1
- Datos de transporte (salida y retorno)
- Objetivos de participación
- Criterios de selección
- Requerimientos presupuestarios
- Deportistas participantes con sus roles
- Entrenadores participantes con sus roles
- Observaciones (opcional)

Validaciones:
- La ColeccionAval debe existir
- La ColeccionAval NO debe tener ya un AvalTecnico ACTIVO (no eliminado lógicamente)
  * Si existe un AvalTecnico pero está eliminado (deleted: true), se permite crear uno nuevo
  * Si existe un AvalTecnico activo (deleted: false), se rechaza la creación
- El número de deportistas debe coincidir con el evento
- Todos los deportistas, entrenadores y rubros deben existir

Al crear el aval técnico:
- Se crea el AvalTecnico con todos los datos de la solicitud
- Se registra el historial en estado SOLICITADO
- Se actualiza el estado del evento a SOLICITADO
      `.trim(),
    }),
    SuccessMessage('Solicitud de aval creada exitosamente'),
    ApiCreatedResponseData(AvalResponseDto, undefined, 'Solicitud de aval creada exitosamente'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 409, 500], {
      400: {
        type: 'https://api.tu-dominio.com/errors/bad-request',
        title: 'Bad Request',
        status: 400,
        detail: 'El número de deportistas no coincide con el evento o la colección ya tiene un aval técnico',
        instance: '/api/v1/avales',
      },
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'ColeccionAval, deportista, entrenador o rubro no encontrado',
        instance: '/api/v1/avales',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de subir archivo del aval
 */
export function ApiUploadAvalArchivo() {
  return applyDecorators(
    ApiOperation({
      summary: 'Subir archivo del aval',
      description: `
Permite subir el documento del aval firmado o cualquier archivo relacionado.

Validaciones:
- El aval debe existir
- Solo se permiten archivos JPG, JPEG, PNG o PDF
- Tamaño máximo: 5MB
      `.trim(),
    }),
    SuccessMessage('Archivo del aval subido correctamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del aval' }),
    ApiOkResponseData(AvalResponseDto, undefined, 'Archivo subido correctamente'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'Aval no encontrado',
        instance: '/api/v1/avales/{id}/archivo',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de descarga de PDF DTM
 */
export function ApiDownloadDtmPdf() {
  return applyDecorators(
    ApiOperation({
      summary: 'Descargar PDF de solicitud DTM',
      description: 'Genera y descarga el PDF de la solicitud para DTM (Dirección Técnico Metodológica)',
    }),
    SuccessMessage('PDF generado exitosamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del aval' }),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500]),
  );
}

/**
 * Decorador para el endpoint de descarga de PDF PDA
 */
export function ApiDownloadPdaPdf() {
  return applyDecorators(
    ApiOperation({
      summary: 'Descargar PDF de certificación PDA',
      description: 'Genera y descarga el PDF de certificación para PDA (Preparación del Deportista de Alto Rendimiento)',
    }),
    SuccessMessage('PDF generado exitosamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del aval' }),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500]),
  );
}

/**
 * Decorador para el endpoint de aprobar aval
 */
export function ApiAprobarAval() {
  return applyDecorators(
    ApiOperation({
      summary: 'Aprobar solicitud de aval',
      description: `
Aprueba una solicitud de aval (solo DTM).

Validaciones:
- El aval debe estar en estado SOLICITADO
- El usuario debe tener rol DTM, DTM_EIDE, Admin o SuperAdmin

Al aprobar:
- Se actualiza el estado del aval a ACEPTADO
- Se actualiza el estado del evento a ACEPTADO
- Se registra en el historial con el usuario que aprobó
      `.trim(),
    }),
    SuccessMessage('Aval aprobado exitosamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del aval' }),
    ApiOkResponseData(AvalResponseDto, undefined, 'Aval aprobado exitosamente'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500], {
      400: {
        type: 'https://api.tu-dominio.com/errors/bad-request',
        title: 'Bad Request',
        status: 400,
        detail: 'Solo se pueden aprobar avales en estado SOLICITADO',
        instance: '/api/v1/avales/{id}/aprobar',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de rechazar aval
 */
export function ApiRechazarAval() {
  return applyDecorators(
    ApiOperation({
      summary: 'Rechazar solicitud de aval',
      description: `
Rechaza una solicitud de aval (solo DTM).

Validaciones:
- El aval debe estar en estado SOLICITADO
- El usuario debe tener rol DTM, DTM_EIDE, Admin o SuperAdmin
- Se debe proporcionar un motivo de rechazo

Al rechazar:
- Se actualiza el estado del aval a RECHAZADO
- Se actualiza el estado del evento a RECHAZADO
- Se registra en el historial con el usuario y el motivo
      `.trim(),
    }),
    SuccessMessage('Aval rechazado'),
    ApiParam({ name: 'id', type: Number, description: 'ID del aval' }),
    ApiOkResponseData(AvalResponseDto, undefined, 'Aval rechazado'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500], {
      400: {
        type: 'https://api.tu-dominio.com/errors/bad-request',
        title: 'Bad Request',
        status: 400,
        detail: 'Solo se pueden rechazar avales en estado SOLICITADO',
        instance: '/api/v1/avales/{id}/rechazar',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de historial del aval
 */
export function ApiGetAvalHistorial() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener historial del aval',
      description: `
Retorna el historial completo de cambios de estado del aval.

Incluye:
- Estado anterior y nuevo
- Etapa del flujo en la que ocurrió
- Usuario que realizó el cambio
- Comentarios o motivos
- Fecha y hora del cambio
      `.trim(),
    }),
    SuccessMessage('Historial obtenido exitosamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del aval' }),
    ApiOkResponseData(HistorialResponseDto, true, 'Historial obtenido exitosamente'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500]),
  );
}

/**
 * Decorador para el endpoint de avales por evento
 */
export function ApiGetAvalesByEvento() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar avales de un evento',
      description: 'Retorna todos los avales asociados a un evento específico',
    }),
    SuccessMessage('Avales del evento obtenidos exitosamente'),
    ApiParam({ name: 'eventoId', type: Number, description: 'ID del evento' }),
    ApiOkResponseData(AvalResponseDto, true, 'Avales obtenidos exitosamente'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500]),
  );
}
