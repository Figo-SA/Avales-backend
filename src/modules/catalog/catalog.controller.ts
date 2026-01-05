import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { CatalogService } from './catalog.service';
import {
  ApiGetCatalog,
  ApiGetCategorias,
  ApiGetDisciplinas,
} from './decorators/api-catalog-responses.decorator';

@ApiTags('Catalog')
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
  findAll() {
    return this.catalogService.getCatalog();
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
  findCategorias() {
    return this.catalogService.getCategorias();
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
  @ApiGetDisciplinas()
  findDisciplinas() {
    return this.catalogService.getDisciplinas();
  }
}
