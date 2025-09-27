import { Module } from '@nestjs/common';
import { PasswordService } from './services/password/password.service';
import { ValidationService } from './services/validation/validation.service';

@Module({
  providers: [PasswordService, ValidationService],
  exports: [PasswordService, ValidationService],
})
export class CommonModule {}
