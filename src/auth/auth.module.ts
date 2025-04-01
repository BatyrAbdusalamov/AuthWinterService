import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { NestjsFingerprintModule } from 'nestjs-fingerprint';

@Module({
  imports: [
    NestjsFingerprintModule.forRoot({
      params: ['headers', 'userAgent', 'ipAddress'],
      // cookieOptions: {
      //   name: 'your_cookie_name',
      //   httpOnly: true,
      // },
    }) as Promise<DynamicModule>,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get<string>('JWT_TOKEN_PRIVATE_KEY'),
        publicKey: configService.get<string>('JWT_TOKEN_PUBLIC_KEY'),
        signOptions: {
          algorithm: 'RS256',
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, ConfigService],
})
export class AuthModule {}
