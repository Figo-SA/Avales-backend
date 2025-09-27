import { Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SeedingService } from './seeding.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@ApiTags('Seeding')
@Controller('seeding')
export class SeedingController {
  constructor(private readonly seedingService: SeedingService) {}

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Inicializar base de datos con datos de prueba',
    description:
      'Limpia la base de datos y la llena con datos iniciales para desarrollo y testing. Solo disponible para SUPER_ADMIN y ADMIN.',
  })
  @ApiResponse({
    status: 200,
    description: 'Base de datos inicializada correctamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Base de datos inicializada correctamente',
        },
        timestamp: { type: 'string', example: '2025-09-26T14:30:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requieren permisos de administrador',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor durante el seeding',
  })
  async seedDatabase() {
    return await this.seedingService.seedDatabase();
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener estado actual de la base de datos',
    description:
      'Muestra el conteo de registros en las tablas principales para verificar el estado de la base de datos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de la base de datos obtenido correctamente',
    schema: {
      type: 'object',
      properties: {
        categorias: { type: 'number', example: 4 },
        disciplinas: { type: 'number', example: 4 },
        roles: { type: 'number', example: 8 },
        usuarios: { type: 'number', example: 10 },
        usuarioRoles: { type: 'number', example: 10 },
        isEmpty: { type: 'boolean', example: false },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requieren permisos administrativos',
  })
  async getDatabaseStatus() {
    return await this.seedingService.getDatabaseStatus();
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resetear y re-inicializar base de datos',
    description:
      'Limpia completamente la base de datos y la vuelve a llenar con datos iniciales. Solo disponible para SUPER_ADMIN.',
  })
  @ApiResponse({
    status: 200,
    description: 'Base de datos reseteada e inicializada correctamente',
  })
  @ApiResponse({
    status: 403,
    description:
      'Acceso denegado - Solo SUPER_ADMIN puede resetear la base de datos',
  })
  async resetDatabase() {
    return await this.seedingService.seedDatabase();
  }
}
