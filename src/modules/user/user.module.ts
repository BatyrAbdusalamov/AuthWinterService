import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users as UserModel } from '../../../models/users';
import { RoleModule } from '../role/role.module';
import { Coach } from 'models/couches';

@Module({
  imports: [SequelizeModule.forFeature([UserModel, Coach]), RoleModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
