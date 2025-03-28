import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('The Auth Service API description')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('/swagger/api', app, documentFactory);
  app.useGlobalPipes(new ValidationPipe());
  console.log('server start on: ', configService.get('PORT'));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
