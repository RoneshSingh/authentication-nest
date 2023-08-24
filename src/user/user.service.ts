import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const user = await this.userModel.find();
    return user;
  }
  async findByUsername(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async createUser(user: User): Promise<User> {
    const existingUser = await this.findByUsername(user.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async loginUser(username: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.comparePassword(password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
