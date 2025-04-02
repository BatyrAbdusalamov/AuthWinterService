import { DynamicModule, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { NestjsFingerprintModule } from 'nestjs-fingerprint';
import { FINGERPRINT_PARAMS } from 'src/constant/authConst';

@Global()
@Module({
  imports: [
    NestjsFingerprintModule.forRoot({
      params: FINGERPRINT_PARAMS,
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
  exports: [AuthService],
})
export class AuthModule {}
