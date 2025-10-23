import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test')
  @ApiOperation({
    summary: 'Test email endpoint',
    description: 'Endpoint de prueba para verificar que el envío de emails funciona',
  })
  async testMail() {
    await this.mailService.sendEmail({
      to: 'test@example.com',
      subject: 'Código de Verificación - Prueba',
      template: 'password-reset',
      context: {
        code: '123456',
        email: 'test@example.com',
      },
    });
    return { message: 'Email de prueba enviado con código: 123456' };
  }
}
