import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AthletesService } from './athletes.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { AthleteQueryDto } from './dto/athlete-query.dto';
import {
  ApiGetAthletes,
  ApiGetAthlete,
  ApiGetAthleteByCedula,
  ApiCreateAthlete,
  ApiUpdateAthlete,
  ApiDeleteAthlete,
  ApiRestoreAthlete,
  ApiHardDeleteAthlete,
} from './decorators/api-athletes-responses.decorator';

@ApiTags('Athletes')
@Controller('athletes')
export class AthletesController {
  constructor(private readonly athletesService: AthletesService) {}

  @Get()
  @ApiGetAthletes()
  findAll(@Query() query: AthleteQueryDto) {
    return this.athletesService.findAll(query);
  }

  @Get('search/cedula')
  @ApiGetAthleteByCedula()
  findByCedula(@Query('cedula') cedula: string) {
    return this.athletesService.findByCedula(cedula);
  }

  @Get(':id')
  @ApiGetAthlete()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.athletesService.findOne(id);
  }

  @Post()
  @ApiCreateAthlete()
  create(@Body() dto: CreateAthleteDto) {
    return this.athletesService.create(dto);
  }

  @Patch(':id')
  @ApiUpdateAthlete()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAthleteDto) {
    return this.athletesService.update(id, dto);
  }

  @Delete(':id')
  @ApiDeleteAthlete()
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.athletesService.softDelete(id);
  }

  @Post(':id/restore')
  @ApiRestoreAthlete()
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.athletesService.restore(id);
  }

  @Delete(':id/permanent')
  @ApiHardDeleteAthlete()
  hardDelete(@Param('id', ParseIntPipe) id: number) {
    return this.athletesService.hardDelete(id);
  }
}
