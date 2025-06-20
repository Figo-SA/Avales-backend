import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ValidationService } from 'src/common/services/validation/validation.service';
import { PasswordService } from 'src/common/services/password/password.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ValidationService, PasswordService],
  imports: [AuthModule],
})
export class UsersModule {}
