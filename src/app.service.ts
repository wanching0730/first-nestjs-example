import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public static getHello(): string {
    return 'Hello World!';
  }
}
