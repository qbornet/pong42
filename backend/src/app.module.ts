import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import SessionStoreModule from './session-store/session-store.module';
import ChatModule from './chat/chat.module';
import AppService from './app.service';
import AppController from './app.controller';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [configuration]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api(.*)']
    }),
    ChatModule,
    SessionStoreModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export default class AppModule {}
