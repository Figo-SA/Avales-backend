import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalExceptionFilter } from './common/filters/global-exception/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: ['https://tu-dominio-frontend.com', 'http://localhost:3000'], // Ajusta según tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuración de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ignora propiedades no definidas en DTO
      forbidNonWhitelisted: true, // lanza error si envían propiedades extra
      transform: true, // convierte los tipos (por ejemplo string a number)
    }),
  );

  app.setGlobalPrefix('api/v1'); // Prefijo global para todas las rutas

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Documentos')
    .setDescription('API para la gestión de documentos de Federación Railway')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT', // Nombre del esquema de autenticación
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token en la UI de Swagger
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.useGlobalInterceptors(app.get(ResponseInterceptor));

  app.useGlobalFilters(new GlobalExceptionFilter());

  // iniciar la aplicación
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
