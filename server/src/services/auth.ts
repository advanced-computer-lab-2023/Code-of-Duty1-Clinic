import userModel, { IUser, IUserDocument } from '../models/user.model';
import { HttpError } from '../utils';
import { StatusCodes } from 'http-status-codes';
import { generateToken } from '../utils';
const login = async (username: string, password: string) => {
  console.log(username, password);
  if (!(username && password)) throw new HttpError(StatusCodes.BAD_REQUEST, 'Username and password are required');
  const user = await userModel.findOne({ username: username });
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');
  const isCorrect: Boolean = await user!.isCorrectPassword(password);
  if (!isCorrect) throw new HttpError(StatusCodes.UNAUTHORIZED, 'Incorrect password');
  const token = generateToken(user!._id, user!.role);
  return {
    status: StatusCodes.OK,
    message: 'Login successful',
    JWTToken: token
  };
};
const logout = () => {
  return 'Logout';
};
const register = (info: any) => {
  return 'Register';
};
const changePassword = (username: string, oldPassword: string, newPassword: string) => {
  return 'Change Password';
};
const forgotPassword = (username: string) => {
  return 'Forgot Password';
};

const verifyEmail = (username: string) => {
  return 'Verify Email';
};
const resendVerificationEmail = (username: string) => {
  return 'Resend Verification Email';
};

const updateProfile = (username: string, info: any) => {
  return 'Update Profile';
};
const viewProfile = (username: string) => {
  return 'View Profile';
};

export {
  login,
  logout,
  register,
  changePassword,
  forgotPassword,
  verifyEmail,
  resendVerificationEmail,
  updateProfile,
  viewProfile
};
