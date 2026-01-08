import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { DeletedResourceDto } from 'src/common/dtos/deleted-resource.dto';

import { ValidRoles } from '../auth/interfaces/valid-roles';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import {
  ApiCreateUser,
  ApiGetUser,
  ApiUpdateUser,
  ApiDeleteUser,
  ApiRestoreUser,
  ApiGetUsers,
  ApiGetUsersDeleted,
  ApiUpdatePushToken,
  ApiGetEntrenadores,
} from './decorators/api-user-responses.decorator';
import { GetUser } from '../auth/decorators';
import { Usuario } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiAuth(ValidRoles.superAdmin, ValidRoles.admin)
  @ApiCreateUser()
  create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiAuth(ValidRoles.superAdmin, ValidRoles.admin)
  @ApiGetUsers()
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get('entrenadores')
  @ApiAuth()
  @ApiGetEntrenadores()
  findEntrenadores(@Query() query: UserQueryDto) {
    return this.usersService.findEntrenadores(query);
  }

  @Get('deleted')
  @ApiAuth(ValidRoles.superAdmin, ValidRoles.admin)
  @ApiGetUsersDeleted()
  findDeleted(): Promise<UserResponseDto[]> {
    return this.usersService.findDeleted();
  }

  @Get(':id')
  @ApiAuth(ValidRoles.superAdmin, ValidRoles.admin)
  @ApiGetUser()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @ApiAuth()
  @Patch('profile')
  @ApiUpdateUser()
  updateProfile(@GetUser() user: Usuario, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @ApiAuth(ValidRoles.superAdmin, ValidRoles.admin)
  @Patch(':id')
  @ApiUpdateUser()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiAuth(ValidRoles.superAdmin, ValidRoles.admin)
  @ApiDeleteUser()
  softDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeletedResourceDto> {
    return this.usersService.softDelete(id);
  }

  @Post(':id/restore')
  @ApiAuth(ValidRoles.superAdmin, ValidRoles.admin)
  @ApiRestoreUser()
  restore(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.restore(id);
  }

  @Patch('me/push-token')
  @ApiAuth()
  @ApiUpdatePushToken()
  updateMyPushToken(
    @GetUser() user: Usuario,
    @Body() dto: UpdatePushTokenDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updatePushToken(user.id, dto.pushToken);
  }
}
