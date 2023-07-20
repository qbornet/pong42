import { Injectable } from '@nestjs/common';

@Injectable()
export default class AppService {
  private hello: string;

  constructor() {
    this.hello = 'Hello World!';
  }

  getHello(): string {
    return this.hello;
  }
}
