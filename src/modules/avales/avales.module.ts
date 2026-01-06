import { Module } from '@nestjs/common';
import { AvalesController } from './avales.controller';
import { AvalesService } from './avales.service';
import { StorageService } from 'src/common/services/storage/storage.service';
import { PushNotificationsModule } from '../push-notifications/push-notifications.module';
import { PrinterService } from '../reports/printer/printer.service';

@Module({
  imports: [PushNotificationsModule],
  controllers: [AvalesController],
  providers: [AvalesService, StorageService, PrinterService],
  exports: [AvalesService],
})
export class AvalesModule {}
