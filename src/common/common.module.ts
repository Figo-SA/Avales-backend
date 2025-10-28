import { Module } from '@nestjs/common';
import { PasswordService } from './services/password/password.service';
import { ValidationService } from './services/validation/validation.service';
import { StorageService } from './services/storage/storage.service';

@Module({
  providers: [PasswordService, ValidationService, StorageService],
  exports: [PasswordService, ValidationService, StorageService],
})
export class CommonModule {}
