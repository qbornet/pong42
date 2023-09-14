import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import cookieParser from 'cookie-parser';
import { RedirectionFilter } from './filter/redirect-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  // app start
  const corsOption: CorsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  };

  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOption);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new RedirectionFilter());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
