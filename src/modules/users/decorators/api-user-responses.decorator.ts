import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponsePaginated,
} from 'src/common/swagger/decorators/api-success-responses.decorator';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';
import { UserResponseDto } from '../dto/user-response.dto';
import { DeletedResourceDto } from 'src/common/dtos/deleted-resource.dto';
import {
  ApiResponseDto,
  GlobalMetaDto,
} from 'src/common/dtos/api-response.dto';

/**
 * Decorador para el endpoint de creación de usuario
 */
export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear usuario (solo administradores)',
      description: `
Crea un nuevo usuario en el sistema.

Validaciones:
- Email debe ser único
- Cédula debe ser única (10 dígitos)
- Debe proporcionar al menos un rol válido
- Categoría y disciplina deben existir (si se proporcionan)
      `.trim(),
    }),
    SuccessMessage('Usuario creado correctamente'),
    ApiCreatedResponseData(
      UserResponseDto,
      undefined,
      'Usuario creado correctamente',
      true,
    ),
    ApiErrorResponsesConfig([400, 401, 403, 409, 422, 500], {
      409: {
        type: 'https://api.tu-dominio.com/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: 'El email o la cédula ya existe en el sistema',
        instance: '/api/v1/users/create',
      },
      422: {
        type: 'https://api.tu-dominio.com/errors/unprocessable-entity',
        title: 'Unprocessable Entity',
        status: 422,
        detail: 'Rol, categoría o disciplina no encontrada',
        instance: '/api/v1/users/create',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de listado de usuarios (paginado)
 */
export function ApiGetUsers() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar usuarios (paginado)',
      description: `
Retorna una lista paginada de usuarios activos.

Parámetros de paginación:
- page: Número de página (default: 1)
- limit: Cantidad de registros por página (default: 10)
      `.trim(),
    }),
    SuccessMessage('Usuarios obtenidos correctamente'),
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
      description: 'Resultados por página (default: 10)',
    }),
    ApiOkResponsePaginated(
      UserResponseDto,
      undefined,
      'Usuarios obtenidos correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 403, 500]),
  );
}

/**
 * Decorador para el endpoint de usuarios eliminados
 */
export function ApiGetUsersDeleted() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar usuarios eliminados (soft deleted)',
      description: `
Retorna todos los usuarios que han sido deshabilitados.

Uso: auditoría o recuperación de usuarios eliminados.
      `.trim(),
    }),
    SuccessMessage('Usuarios eliminados obtenidos correctamente'),
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, UserResponseDto),
    ApiOkResponse({
      description: 'Lista de usuarios eliminados',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  message: {
                    type: 'string',
                    example: 'Usuarios eliminados obtenidos correctamente',
                  },
                  meta: { $ref: getSchemaPath(GlobalMetaDto) },
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(UserResponseDto) },
                  },
                },
              },
            ],
          },
        },
      },
    }),
    ApiErrorResponsesConfig([401, 403, 500]),
  );
}

/**
 * Decorador para el endpoint de obtener usuario por ID
 */
export function ApiGetUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener usuario por ID',
      description: 'Retorna los detalles de un usuario activo',
    }),
    SuccessMessage('Usuario obtenido correctamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del usuario' }),
    ApiOkResponseData(
      UserResponseDto,
      undefined,
      'Usuario obtenido correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un usuario con ese ID',
        instance: '/api/v1/users/{id}',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de actualización de usuario
 */
export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar usuario',
      description: `
Actualiza los datos de un usuario existente.

Validaciones:
- Email debe ser único (si se actualiza)
- Cédula debe ser única (si se actualiza)
- Roles deben existir (si se actualizan, reemplazan los anteriores)
- Categoría y disciplina deben existir (si se proporcionan)
      `.trim(),
    }),
    SuccessMessage('Usuario actualizado correctamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del usuario' }),
    ApiOkResponseData(
      UserResponseDto,
      undefined,
      'Usuario actualizado correctamente',
      true,
    ),
    ApiErrorResponsesConfig([400, 401, 403, 404, 409, 422, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un usuario con ese ID',
        instance: '/api/v1/users/{id}',
      },
      409: {
        type: 'https://api.tu-dominio.com/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: 'El email o la cédula ya está en uso',
        instance: '/api/v1/users/{id}',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de soft delete
 */
export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Deshabilitar usuario (soft delete)' }),
    SuccessMessage('Usuario deshabilitado correctamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del usuario' }),
    ApiOkResponseData(
      DeletedResourceDto,
      undefined,
      'Usuario deshabilitado correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un usuario con ese ID',
        instance: '/api/v1/users/{id}',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de restauración
 */
export function ApiRestoreUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Restaurar usuario eliminado' }),
    SuccessMessage('Usuario restaurado correctamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del usuario' }),
    ApiOkResponseData(
      UserResponseDto,
      undefined,
      'Usuario restaurado correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un usuario eliminado con ese ID',
        instance: '/api/v1/users/{id}/restore',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de actualización de push token
 */
export function ApiUpdatePushToken() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar push token',
      description: 'Permite al usuario actualizar su token de Expo para push notifications',
    }),
    SuccessMessage('Push token actualizado correctamente'),
    ApiOkResponseData(
      UserResponseDto,
      undefined,
      'Push token actualizado correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'Usuario no encontrado',
        instance: '/api/v1/users/me/push-token',
      },
    }),
  );
}
