import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users as UserModel } from '../../models/users';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
