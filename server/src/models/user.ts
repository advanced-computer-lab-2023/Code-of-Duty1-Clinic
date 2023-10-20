import { tr } from '@faker-js/faker';
import { Roles, Gender } from '../utils/constants';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
const options = { discriminatorKey: 'role' };

interface ICommonUser {
  username: string;
  password: string;
  name: string;
  email: string;
  birthDate: Date;
  gender: Gender['male'] | Gender['female'];
  phone: string;
  addresses: string[];
  profileImage: string;
  isEmailVerified: boolean;
  wallet: number;
  isCorrectPassword(password: string): boolean;
}
type ICommonUserDocument = ICommonUser & Document;
const commonUserSchema = new Schema<ICommonUserDocument>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
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
      enum: ['male', 'female'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      required: true
    },
    addresses: [String],

    profileImage: {
      type: String,
      required: false
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    wallet: {
      type: Number,
      default: 0
    }
  },
  options
);

commonUserSchema.virtual('request', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'medicID',
  justOne: false
});

commonUserSchema.virtual('contract', {
  ref: 'Contract',
  localField: '_id',
  foreignField: 'doctorID'
});

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
const userModel: mongoose.Model<ICommonUserDocument> = mongoose.model<ICommonUserDocument>('User', commonUserSchema);

export default userModel<ICommonUserDocument>;

export { ICommonUser, ICommonUserDocument };
