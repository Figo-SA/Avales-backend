// dto/update-user.dto.ts
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

import { UserEditableDto } from './user-editable.dto';

export class UpdateUserProfileDto extends PartialType(UserEditableDto) {
  @ApiPropertyOptional({ example: 'newpass123', minLength: 6, maxLength: 32 })
  @IsOptional()
  @IsString()
  @Length(6, 32)
  password?: string;
}
