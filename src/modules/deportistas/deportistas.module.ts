import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DeportistasController } from './deportistas.controller';
import { DeportistasService } from './deportistas.service';

@Module({
  imports: [HttpModule],
  controllers: [DeportistasController],
  providers: [DeportistasService],
})
export class DeportistasModule {}
