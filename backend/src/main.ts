import { NestFactory } from '@nestjs/core';
import Config from './config/configuration';
import AppModule from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Config().port);
}
bootstrap();
