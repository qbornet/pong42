import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ImgController } from './img.controller';
import { ImgService } from './img.service';

@Module({
  imports: [AuthModule],
  controllers: [ImgController],
  providers: [ImgService]
})
export class ImgModule {}
