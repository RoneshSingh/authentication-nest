import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ default: () => new mongoose.Types.ObjectId() })
  @ApiProperty()
  userId: mongoose.Types.ObjectId;

  @Prop({ unique: true })
  @ApiProperty()
  username: string;
  @Prop()
  @ApiProperty()
  firstname: string;
  @Prop()
  @ApiProperty()
  lastname: string;
  @Prop()
  @ApiProperty()
  password: string;
  @Prop()
  @ApiProperty()
  email: string;

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
