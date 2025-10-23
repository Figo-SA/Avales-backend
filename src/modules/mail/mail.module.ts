import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailController } from './mail.controller';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST || 'localhost',
          port: +(process.env.SMTP_PORT || 1025),
          secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
          auth: process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              }
            : undefined,
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: process.env.SMTP_FROM || 'noreply@example.com',
        },
        template: {
          dir: join(process.cwd(), 'dist', 'templates'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
