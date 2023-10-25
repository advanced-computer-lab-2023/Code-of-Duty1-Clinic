import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const options = { discriminatorKey: 'role' };

interface ICommonUser {
  username: string;
  password: string;
  name: string;
  email: string;
  birthDate?: Date;
  gender?: 'Male' | 'Female';
  phone: string;
  role?: string;
  isCorrectPassword?(password: string): boolean;
}

type ICommonUserDocument = ICommonUser & Document;

const commonUserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Email is not Valid']
    },
    birthDate: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      required: true
    }
  },
  options
);

commonUserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  const Rounds = 10;
  const salt = bcrypt.genSaltSync(Rounds);
  const hashedPassword = bcrypt.hashSync(this.password, salt);

  this.password = hashedPassword;
  next();
});
commonUserSchema.methods.isCorrectPassword = function (enteredPassword: string): boolean {
  return bcrypt.compareSync(enteredPassword, this.password);
};

const User: mongoose.Model<ICommonUserDocument> = mongoose.model<ICommonUserDocument>('User', commonUserSchema);

export default User;

export { ICommonUser, ICommonUserDocument };
