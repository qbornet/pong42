import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import DatabaseModule from './database/database.module';
import ChatModule from './chat/chat.module';
import AppService from './app.service';
import AppController from './app.controller';
import configuration from './config/configuration';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [configuration]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api(.*)']
    }),
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export default class AppModule {}
