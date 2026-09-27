import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para toda la API
  // Ej: http://localhost:3000/api/v1/students
  app.setGlobalPrefix('api/v1');

  // - transform: convierte el payload al tipo del DTO automáticamente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro global de excepciones (respuestas de error uniformes)
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS habilitado (útil para pruebas desde frontend o Postman)
  app.enableCors();

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  console.log('=====================================================');
  console.log('🎓 API - Universidad Mariano Gálvez de Guatemala');
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}/api/v1`);
  console.log('=====================================================');
}
bootstrap();