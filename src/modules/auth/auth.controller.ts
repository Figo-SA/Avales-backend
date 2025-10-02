// src/auth/auth.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
// import { Auth, GetUser } from './decorators';

// import { ValidRoles } from './interfaces/valid-roles';
// import { UsuarioConRoles } from './interfaces/usuario-roles';
// import { cleanUser } from 'src/common/herlpers/clean-user';
import { ProblemDetailsDto } from 'src/common/dtos/problem-details.dto';
import {
  ApiResponseDto,
  GlobalMetaDto,
} from 'src/common/dtos/api-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiOkResponseData } from 'src/common/swagger/decorators/api-success-responses.decorator';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Helper para documentar errores RFC7807 en varios códigos
  private static problemContent = {
    content: {
      'application/problem+json': {
        schema: { $ref: getSchemaPath(ProblemDetailsDto) },
      },
    },
  };

  @ApiExtraModels(
    ApiResponseDto,
    GlobalMetaDto,
    ProblemDetailsDto,
    LoginResponseDto,
  )
  @Post('login')
  @ApiOperation({ summary: 'Inicia sesión y obtiene un token JWT' })
  @ApiBody({ description: 'Credenciales de inicio de sesión', type: LoginDto })
  @ApiOkResponseData(
    LoginResponseDto,
    undefined, // ← sin ejemplo manual
    'Login exitoso',
    true, // ← incluir meta en el schema
  )
  @ApiErrorResponsesConfig([400, 401, 422, 500], {
    401: {
      type: 'https://api.tu-dominio.com/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Email o contraseña incorrectos',
      instance: '/api/v1/auth/login',
      requestId: '...',
      apiVersion: 'v1',
    },
    422: {
      type: 'https://api.tu-dominio.com/errors/unprocessable-entity',
      title: 'Unprocessable Entity',
      status: 422,
      detail: 'Cuenta bloqueada por intentos fallidos',
      instance: '/api/v1/auth/login',
      requestId: '...',
      apiVersion: 'v1',
    },
  })
  login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  // @Get('check-status')
  // @Auth()
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Verifica el estado de autenticación actual' })
  // @ApiOkResponse({
  //   description: 'Estado válido; devuelve el usuario o datos de sesión',
  //   schema: {
  //     allOf: [
  //       { $ref: getSchemaPath(ApiResponseDto) },
  //       {
  //         properties: {
  //           data: { $ref: getSchemaPath(Userreson) }, // ajusta si devuelves otra cosa
  //         },
  //       },
  //     ],
  //   },
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Unauthorized',
  //   ...AuthController.problemContent,
  // })
  // getStatus(@GetUser() user: UsuarioConRoles) {
  //   return this.authService.checkAuthStatus(user);
  // }

  // @Get('me')
  // @Auth()
  // @ApiOperation({ summary: 'Obtiene el perfil del usuario autenticado' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Perfil del usuario autenticado',
  // })
  // getProfile(@GetUser() user: UsuarioConRoles) {
  //   return cleanUser(user);
  // }

  // @Get('private3')
  // @Auth(ValidRoles.superAdmin)
  // privateRoute3(@GetUser() user: UsuarioConRoles) {
  //   return {
  //     ok: true,
  //     message: 'You have accessed a private route',
  //     user: cleanUser(user),
  //   };
  // }
}
