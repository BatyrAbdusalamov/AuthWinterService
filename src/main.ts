import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: ['*'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('The Auth Service API description')
    .setVersion('1.0')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const documentFactory = () => {
    const document = SwaggerModule.createDocument(app, config, options);
    document.paths['/file/{name.type}'] = {
      get: {
        tags: ['File'],
        summary: 'Get static files',
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'text/plain': {
                schema: {
                  type: 'binary',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['File'],
        summary: 'Create static file',
        requestBody: {
          content: {
            'text/plain': {
              schema: {
                type: 'binary',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Create file',
            content: undefined,
          },
          204: {
            description: 'Changed file',
            content: undefined,
          },
        },
      },
    };
    return document;
  };
  SwaggerModule.setup('/swagger/api', app, documentFactory);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(4000);
  console.log('server start on: ', configService.get('PORT'));
}
bootstrap();
