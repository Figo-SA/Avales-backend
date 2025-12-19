import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponsePaginated,
} from 'src/common/swagger/decorators/api-success-responses.decorator';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';
import { ResponseUserDto } from '../dto/response-user.dto';
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
    ApiOperation({ summary: 'Crea un nuevo usuario (solo administradores)' }),
    SuccessMessage('Usuario creado correctamente'),
    ApiCreatedResponseData(
      ResponseUserDto,
      undefined,
      'Usuario creado correctamente',
      true,
    ),
    ApiErrorResponsesConfig([400, 401, 403, 409, 422, 500], {
      409: {
        type: 'https://api.tu-dominio.com/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: 'El email o la cédula ya existe en el sistema. Debe ser único.',
        instance: '/api/v1/users/create',
        apiVersion: 'v1',
      },
      422: {
        type: 'https://api.tu-dominio.com/errors/unprocessable-entity',
        title: 'Unprocessable Entity',
        status: 422,
        detail:
          'Reglas de dominio no cumplidas. Posibles causas: rol inexistente, categoría inexistente, disciplina inexistente, o no se proporcionó al menos un rol.',
        instance: '/api/v1/users/create',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de listado paginado de usuarios
 */
export function ApiGetUsersPaginated() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene la lista de usuarios (paginado)',
      description: `
Retorna una lista paginada de usuarios activos (no eliminados) del sistema.

**Parámetros de paginación:**
- page: Número de página (default: 1)
- limit: Cantidad de registros por página (default: 10)

**Nota:** Solo retorna usuarios con deleted=false
      `.trim(),
    }),
    SuccessMessage('Datos de usuarios obtenidos correctamente (paginado)'),
    ApiOkResponsePaginated(
      ResponseUserDto,
      undefined,
      'Usuarios obtenidos correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 403, 500]),
  );
}

/**
 * Decorador para el endpoint de listado completo de usuarios
 */
export function ApiGetUsers() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene la lista de todos los usuarios (sin paginar)',
      description: `
Retorna todos los usuarios activos del sistema sin paginación.

**Advertencia:** Este endpoint puede retornar una gran cantidad de datos.
Para consultas con muchos usuarios, se recomienda usar el endpoint paginado.

**Nota:** Solo retorna usuarios con deleted=false
      `.trim(),
    }),
    SuccessMessage('Datos de usuarios obtenidos correctamente'),
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, ResponseUserDto),
    ApiOkResponse({
      description: 'Lista de usuarios obtenida correctamente',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  message: {
                    type: 'string',
                    example: 'Datos de usuarios obtenidos correctamente',
                  },
                  meta: { $ref: getSchemaPath(GlobalMetaDto) },
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(ResponseUserDto) },
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
 * Decorador para el endpoint de usuarios eliminados
 */
export function ApiGetUsersDeleted() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene la lista de usuarios eliminados (soft deleted)',
      description: `
Retorna todos los usuarios que han sido deshabilitados mediante soft delete.

**Uso típico:** Auditoría o recuperación de usuarios eliminados.

**Nota:** Solo retorna usuarios con deleted=true. Estos usuarios pueden ser restaurados usando el endpoint /users/:id/restore
      `.trim(),
    }),
    SuccessMessage('Usuarios eliminados obtenidos correctamente'),
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, ResponseUserDto),
    ApiOkResponse({
      description: 'Lista de usuarios eliminados obtenida correctamente',
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
                    items: { $ref: getSchemaPath(ResponseUserDto) },
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
 * Decorador para el endpoint de obtener un usuario por ID
 */
export function ApiGetUser() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Obtiene los detalles de un usuario por ID (solo administradores)',
      description: `
Retorna los detalles completos de un usuario específico incluyendo sus roles asignados.

**Nota:** Solo retorna usuarios activos (deleted=false)
      `.trim(),
    }),
    SuccessMessage('Datos del usuario obtenidos correctamente'),
    ApiOkResponseData(
      ResponseUserDto,
      undefined,
      'Usuario obtenido correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un usuario activo con ese id',
        instance: '/api/v1/users/{id}',
        apiVersion: 'v1',
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
      summary: 'Actualizar un usuario',
      description: `
Actualiza los datos de un usuario existente con las siguientes validaciones:

**Validaciones de unicidad:**
- Email debe ser único (exceptuando el usuario actual)
- Cédula debe ser única (exceptuando el usuario actual)

**Validaciones de integridad referencial:**
- Todos los roles (nombres) deben existir en la tabla de roles (si se proporcionan)
- categoriaId debe existir (si se proporciona)
- disciplinaId debe existir (si se proporciona)

**Reglas de negocio:**
- Si se actualizan roles, se eliminarán los roles anteriores y se asignarán los nuevos
- Si se actualiza la contraseña, será hasheada automáticamente
- Solo se actualizan los campos proporcionados (actualización parcial)
      `.trim(),
    }),
    SuccessMessage('Usuario actualizado correctamente'),
    ApiOkResponseData(
      ResponseUserDto,
      undefined,
      'Usuario actualizado correctamente',
      true,
    ),
    ApiErrorResponsesConfig([400, 401, 403, 404, 409, 422, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un usuario con ese id o está deshabilitado',
        instance: '/api/v1/users/{id}',
        apiVersion: 'v1',
      },
      409: {
        type: 'https://api.tu-dominio.com/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail:
          'El email o la cédula ya está en uso por otro usuario. Debe ser único.',
        instance: '/api/v1/users/{id}',
        apiVersion: 'v1',
      },
      422: {
        type: 'https://api.tu-dominio.com/errors/unprocessable-entity',
        title: 'Unprocessable Entity',
        status: 422,
        detail:
          'Reglas de dominio no cumplidas. Posibles causas: rol inexistente, categoría inexistente, o disciplina inexistente.',
        instance: '/api/v1/users/{id}',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de soft delete de usuario
 */
export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Deshabilitar (borrado logico) un usuario' }),
    SuccessMessage('Usuario deshabilitado correctamente'),
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
        detail: 'No existe un usuario activo con ese id',
        instance: '/api/v1/users/{id}',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de hard delete de usuario
 */
export function ApiHardDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar un usuario de forma permanente' }),
    SuccessMessage('Usuario eliminado permanentemente'),
    ApiNoContentResponse({ description: 'Eliminado permanentemente' }),
    ApiErrorResponsesConfig([401, 403, 404, 409, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un usuario activo con ese id',
        instance: '/api/v1/users/{id}/hard',
        apiVersion: 'v1',
      },
      409: {
        type: 'https://api.tu-dominio.com/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: 'No se puede eliminar: dependencias existentes',
        instance: '/api/v1/users/{id}/hard',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de restauración de usuario
 */
export function ApiRestoreUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Restaurar un usuario eliminado' }),
    SuccessMessage('Usuario restaurado correctamente'),
    ApiOkResponseData(
      ResponseUserDto,
      undefined,
      'Usuario restaurado correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un usuario eliminado con ese id',
        instance: '/api/v1/users/{id}/restore',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de actualización de perfil de usuario
 * ApiAuth()
 @Patch('profile')
 @ApiUpdateUser()
 updateProfile(@GetUser() user: Usuario, @Body() dto: UpdateUserDto) {
   return this.usersService.updateProfile(user.id, dto);
 }
 */
export function ApiUpdateProfile() {
  return applyDecorators(
    ApiOperation({ summary: 'Actualizar perfil de usuario' }),
    SuccessMessage('Perfil actualizado correctamente'),
    ApiOkResponseData(
      ResponseUserDto,
      undefined,
      'Perfil actualizado correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un usuario activo con ese id',
        instance: '/api/v1/users/{id}/profile',
        apiVersion: 'v1',
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
      summary: 'Actualizar push token del usuario actual',
      description:
        'Permite al usuario autenticado actualizar su token de Expo para recibir push notifications',
    }),
    SuccessMessage('Push token actualizado correctamente'),
    ApiOkResponseData(
      ResponseUserDto,
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
        apiVersion: 'v1',
      },
    }),
  );
}
