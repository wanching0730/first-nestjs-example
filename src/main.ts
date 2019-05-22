import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerBaseConfig, SwaggerDocument } from '@nestjs/swagger';

async function bootstrap() {
  const appOptions = {cors: true};
  const app = await NestFactory.create(AppModule, appOptions);
  app.setGlobalPrefix('api');

  let options: SwaggerBaseConfig;
  options = new DocumentBuilder()
      .setTitle('NestJS Example App')
      .setDescription('The API description')
      .setVersion('1.0')
      .setBasePath('api')
      .build();

  let document: SwaggerDocument;
  document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(3000);
}
bootstrap();
