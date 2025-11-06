import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PushNotificationsService } from './push-notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@ApiTags('Push Notifications')
@Controller('push-notifications')
export class PushNotificationsController {
  constructor(
    private readonly pushNotificationsService: PushNotificationsService,
  ) {}

  @Post('send')
  @Auth(ValidRoles.admin, ValidRoles.superAdmin)
  @ApiOperation({
    summary: 'Enviar notificación push',
    description: 'Envía una notificación push a los tokens especificados',
  })
  async sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
    return this.pushNotificationsService.sendNotification(
      sendNotificationDto.tokens,
      sendNotificationDto.title,
      sendNotificationDto.body,
      sendNotificationDto.data,
    );
  }
}
