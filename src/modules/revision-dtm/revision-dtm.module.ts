import { Module } from '@nestjs/common';
import { RevisionDtmService } from './revision-dtm.service';
import { RevisionDtmController } from './revision-dtm.controller';

@Module({
  controllers: [RevisionDtmController],
  providers: [RevisionDtmService],
})
export class RevisionDtmModule {}
