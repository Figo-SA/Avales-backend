import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RevisionDtmService } from './revision-dtm.service';
import { CreateRevisionDtmDto } from './dto/create-revision-dtm.dto';
import { UpdateRevisionDtmDto } from './dto/update-revision-dtm.dto';

@Controller('revision-dtm')
export class RevisionDtmController {
  constructor(private readonly revisionDtmService: RevisionDtmService) {}

  @Post()
  create(@Body() createRevisionDtmDto: CreateRevisionDtmDto) {
    return this.revisionDtmService.create(createRevisionDtmDto);
  }

  @Get()
  findAll() {
    return this.revisionDtmService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.revisionDtmService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRevisionDtmDto: UpdateRevisionDtmDto) {
    return this.revisionDtmService.update(+id, updateRevisionDtmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.revisionDtmService.remove(+id);
  }
}
