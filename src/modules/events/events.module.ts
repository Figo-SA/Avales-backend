import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { CollectionsController } from './collections.controller';
import { AvalsDeprecatedController } from './avals.controller';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { PushNotificationsModule } from '../push-notifications/push-notifications.module';
import { PrinterModule } from '../reports/printer/printer.module';

@Module({
  controllers: [EventsController, CollectionsController, AvalsDeprecatedController],
  providers: [EventsService],
  imports: [AuthModule, CommonModule, PushNotificationsModule, PrinterModule],
})
export class EventsModule {}
