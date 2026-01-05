import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { CatalogService } from './catalog.service';
import {
  ApiGetActividades,
  ApiGetCatalog,
  ApiGetCategorias,
  ApiGetDisciplinas,
  ApiGetItem,
  ApiGetItems,
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

  @Get('actividades')
  @ApiAuth(
    ValidRoles.superAdmin,
    ValidRoles.admin,
    ValidRoles.secretaria,
    ValidRoles.pda,
    ValidRoles.financiero,
  )
  @ApiGetActividades()
  findActividades() {
    return this.catalogService.getActividades();
  }

  @Get('items')
  @ApiAuth(
    ValidRoles.superAdmin,
    ValidRoles.admin,
    ValidRoles.secretaria,
    ValidRoles.pda,
    ValidRoles.financiero,
  )
  @ApiGetItems()
  findItems(@Query('actividadId') actividadId?: string) {
    const parsedActividadId = actividadId ? parseInt(actividadId, 10) : undefined;
    return this.catalogService.getItems(parsedActividadId);
  }

  @Get('items/:id')
  @ApiAuth(
    ValidRoles.superAdmin,
    ValidRoles.admin,
    ValidRoles.secretaria,
    ValidRoles.pda,
    ValidRoles.financiero,
  )
  @ApiGetItem()
  findItem(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.getItemById(id);
  }
}
