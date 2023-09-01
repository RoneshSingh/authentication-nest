import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import * as bcrypt from "bcrypt";
import mongoose from "mongoose";

export class Registration {
  @Prop({ default: () => new mongoose.Types.ObjectId() })
  userId: mongoose.Types.ObjectId;
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  email: string;

  role: string;

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
