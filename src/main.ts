import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.use(cookieParser());

  // Configuración de CORS
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origen (Swagger, Postman, cURL)
      if (!origin) return callback(null, true);

      // Aquí podrías validar orígenes permitidos
      // Por ahora aceptas todos en desarrollo:
      return callback(null, true);
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Documentos')
    .setDescription('API para la gestión de documentos de Federación Railway')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT', // Nombre del esquema de autenticación
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token en la UI de Swagger
    },
  });

  await app.listen(process.env.PORT || 3000);
  logger.log(`Application is running on PORT: ${process.env.PORT ?? 3000}`);
}
bootstrap();
