import { Module } from '@nestjs/common';
import { AvalTecnicosService } from './aval-tecnicos.service';
import { AvalTecnicosController } from './aval-tecnicos.controller';

@Module({
  controllers: [AvalTecnicosController],
  providers: [AvalTecnicosService],
})
export class AvalTecnicosModule {}
