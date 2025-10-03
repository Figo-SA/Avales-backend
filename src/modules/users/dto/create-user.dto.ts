// dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { UserEditableDto } from './user-editable.dto';

export class CreateUserDto extends UserEditableDto {
  @ApiProperty({ example: 'password123', minLength: 6, maxLength: 32 })
  @IsString()
  @Length(6, 32)
  password: string;

  // Si para create exiges al menos un rol:
  @ApiProperty({ example: [3, 7], description: 'IDs de roles (mín. 1)' })
  declare rolIds: number[];
}
