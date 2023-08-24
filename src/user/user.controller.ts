import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { AuthService } from './auth.service';

import { Login } from './login.mode';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getAllUser(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('create')
  async createUser(@Body() user: User): Promise<User> {
    let response;
    try {
      const data = await this.userService.createUser(user);
      console.log(data);
      response = { status: 'Successfully created User', details: data };
    } catch (error) {
      response = new HttpException(
        "Couldn't create the user",
        HttpStatus.BAD_REQUEST,
      );
    }
    return response;
  }

  @Post('login')
  async loginUser(@Body() loginData: Login) {
    let user: any;
    let userDetails: any;
    try {
      user = await this.authService.validateUser(
        loginData.username,
        loginData.password,
      );
      userDetails = await this.userService.findByUsername(loginData.username);
      const { username, lastname, firstname, email } = userDetails;
      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      const token = await this.authService.login(user);
      return {
        message: 'Login successful',
        token,
        userDetails: { username, lastname, firstname, email },
      };
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('protected')
  async protectedRoute(@Request() req) {
    try {
      const decodedToken = await this.authService.validateToken(
        req.headers.authorization,
      );
      console.log(decodedToken);
      return { status: 'Access granted', tokenDetails: decodedToken };
    } catch (error) {
      throw error;
    }
  }
}
