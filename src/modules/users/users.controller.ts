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
import { ResponseUserDto } from './dto/response-user.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { DeletedResourceDto } from 'src/common/dtos/deleted-resource.dto';
import { PaginationMetaDto } from 'src/common/dtos/pagination-meta.dto';

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
  ApiHardDeleteUser,
  ApiUpdatePushToken,
} from './decorators/api-user-responses.decorator';
import { GetUser } from '../auth/decorators';
import { Usuario } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiAuth(ValidRoles.superAdmin, ValidRoles.admin)
  @ApiCreateUser()
  create(@Body() dto: CreateUserDto): Promise<ResponseUserDto> {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiAuth(ValidRoles.superAdmin, ValidRoles.admin)
  @ApiGetUsers()
  findAll(
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<{ items: ResponseUserDto[]; pagination: PaginationMetaDto }> {
    return this.usersService.findAll(paginationDto.page, paginationDto.limit);
  }

  @Get('deleted')
  @ApiAuth(ValidRoles.superAdmin, ValidRoles.admin)
  @ApiGetUsersDeleted()
  findDeleted(): Promise<ResponseUserDto[]> {
    return this.usersService.findDeleted();
  }

  @Get(':id')
  @ApiAuth(ValidRoles.superAdmin, ValidRoles.admin)
  @ApiGetUser()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseUserDto> {
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
  updateUserByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
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
  restore(@Param('id', ParseIntPipe) id: number): Promise<ResponseUserDto> {
    return this.usersService.restore(id);
  }

  @Patch('me/push-token')
  @ApiAuth()
  @ApiUpdatePushToken()
  updateMyPushToken(
    @GetUser() user: Usuario,
    @Body() dto: UpdatePushTokenDto,
  ): Promise<ResponseUserDto> {
    return this.usersService.updatePushToken(user.id, dto.pushToken);
  }
}
