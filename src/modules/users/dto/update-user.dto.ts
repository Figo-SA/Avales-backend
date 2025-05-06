import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { BaseUserDto } from './base-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
