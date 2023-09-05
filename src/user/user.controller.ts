import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./schemas/user.schema";
import { AuthService } from "./auth.service";

import { Login } from "./model/login.model";
import { Registration } from "./model/registration.user.model";

@Controller("users")
export class UserController {
  constructor(
    private userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Get()
  async getAllUser(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post("create")
  async createUser(@Body() user: Registration): Promise<User> {
    user.role = "user";
    let response;
    try {
      const data = await this.userService.createUser(user);

      response = { status: "Successfully created User", details: data };
    } catch (error) {
      response = new HttpException(
        "Couldn't create the user",
        HttpStatus.BAD_REQUEST
      );
    }
    return response;
  }

  // When we need admin

  @Post("createadmin")
  async createAdmin(@Body() user: User): Promise<User> {
    let response;
    try {
      const data = await this.userService.createUser(user);
      console.log(data);
      response = { status: "Successfully created User", details: data };
    } catch (error) {
      response = new HttpException(
        "Couldn't create the user",
        HttpStatus.BAD_REQUEST
      );
    }
    return response;
  }

  @Post("login")
  async loginUser(@Body() loginData: Login) {
    let user: any;
    let userDetails: any;
    try {
      user = await this.authService.validateUser(
        loginData.username,
        loginData.password
      );
      userDetails = await this.userService.findByUsername(loginData.username);
      //console.log(userDetails);
      const { username, lastname, firstname, email } = userDetails;
      if (!user) {
        throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
      }
      const token = await this.authService.login(userDetails);
      return {
        message: "Login successful",
        token,
        userDetails: { username, lastname, firstname, email },
      };
    } catch (error) {
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }
  }

  @Get("protected")
  async protectedRoute(@Request() req) {
    try {
      const decodedToken = await this.authService.validateToken(
        req.headers.authorization
      );
      //console.log(decodedToken);
      return { status: "Access granted", tokenDetails: decodedToken };
    } catch (error) {
      throw error;
    }
  }
}
