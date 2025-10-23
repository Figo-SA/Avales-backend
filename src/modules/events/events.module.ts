import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [AuthModule],
})
export class EventsModule {}
