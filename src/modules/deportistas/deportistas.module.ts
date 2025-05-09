import { Module } from '@nestjs/common';
import { DeportistasService } from './deportistas.service';
import { DeportistasController } from './deportistas.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationService } from 'src/common/services/validation/validation.service';

@Module({
  controllers: [DeportistasController],
  providers: [DeportistasService, PrismaService, ValidationService],
})
export class DeportistasModule {}
