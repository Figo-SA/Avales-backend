import { Module } from '@nestjs/common';
import { DeportistasService } from './deportistas.service';
import { DeportistasController } from './deportistas.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationService } from 'src/common/services/validation/validation.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [DeportistasController],
  providers: [DeportistasService, PrismaService, ValidationService],
  imports: [AuthModule],
})
export class DeportistasModule {}
