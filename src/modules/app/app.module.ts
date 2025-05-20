import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { APP_PIPE } from '@nestjs/core';
import { Roles } from 'models/roles';
import { AppController } from './app.controller';
import { UserModule } from '../user/user.module';
import { Users } from 'models/users';
import { Coach } from 'models/couches';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get('DB_DIALECT'),
        host: configService.get('DB_HOST'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        port: Number(configService.get('DB_PORT')),
        database: configService.get('DB_NAME'),
        models: [Users, Roles, Coach] as any[],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
