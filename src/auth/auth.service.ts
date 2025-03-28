import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users as UserModel } from 'models/users';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel)
    private readonly userRepository: typeof UserModel,
  ) {}
  async refreshInToken(refreshToken: string, salt: number) {
    
  }
}
