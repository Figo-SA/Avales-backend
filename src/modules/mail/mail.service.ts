import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(email: string, code: string) {
    try {
      const sendMailParams = {
        to: email,
        from: process.env.SMTP_FROM || 'noreply@example.com',
        subject: 'Código de recuperación de contraseña',
        template: 'password-reset',
        context: {
          code,
          email,
        },
      };

      await this.mailerService.sendMail(sendMailParams);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(params: {
    subject: string;
    template: string;
    context: ISendMailOptions['context'];
    to: string;
  }) {
    try {
      const sendMailParams = {
        to: params.to,
        from: process.env.SMTP_FROM || 'noreply@example.com',
        subject: params.subject,
        template: params.template,
        context: params.context,
      };

      await this.mailerService.sendMail(sendMailParams);
    } catch (error) {
      throw error;
    }
  }
}
