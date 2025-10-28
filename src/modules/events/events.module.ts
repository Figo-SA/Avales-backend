import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { PushNotificationsModule } from '../push-notifications/push-notifications.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [AuthModule, CommonModule, PushNotificationsModule],
})
export class EventsModule {}
