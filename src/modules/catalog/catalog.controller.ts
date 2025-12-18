import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { CatalogService } from './catalog.service';
import { ApiGetCatalog } from './decorators/api-get-catalogo.decorator';
import { ApiGetCategorias } from './decorators/api-get-categoria.decorator';
import { ApiGetDisciplina } from './decorators/api-get-disciplina.decorator';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @ApiAuth(
    ValidRoles.superAdmin,
    ValidRoles.admin,
    ValidRoles.secretaria,
    ValidRoles.entrenador,
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
  )
  @ApiGetCatalog()
  async getAll() {
    return await this.catalogService.getCatalog();
  }

  @Get('categorias')
  @ApiAuth(
    ValidRoles.superAdmin,
    ValidRoles.admin,
    ValidRoles.secretaria,
    ValidRoles.entrenador,
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
  )
  @ApiGetCategorias()
  async getCategorias() {
    return await this.catalogService.getCategorias();
  }

  @Get('disciplinas')
  @ApiAuth(
    ValidRoles.superAdmin,
    ValidRoles.admin,
    ValidRoles.secretaria,
    ValidRoles.entrenador,
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
  )
  @ApiGetDisciplina()
  async getDisciplinas() {
    return await this.catalogService.getDisciplinas();
  }
}
