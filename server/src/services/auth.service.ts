import { StatusCodes } from 'http-status-codes';
import { HttpError, generateToken, putRedis, delRedis, sendResetPasswordEmail, getRedis } from '../utils';
import { User, Request, ICommonUser } from '../models';

const login = async (body: any) => {
  const { username, password } = body;
  if (!username || !password) throw new HttpError(StatusCodes.BAD_REQUEST, 'Username and password are required');

  const user = await User.findOne({ username: username }).select('+password');
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  const isCorrect: boolean = user.isCorrectPassword!(password);
  if (!isCorrect) throw new HttpError(StatusCodes.UNAUTHORIZED, 'Incorrect password');

  const token = generateToken(user._id.toString(), user.role!);
  putRedis(user._id.toString(), token);

  return {
    status: StatusCodes.OK,
    message: 'Login successful',
    token
  };
};

const register = async (body: any) => {
  if (!['Patient', 'Doctor', 'Admin'].includes(body.role))
    throw new Error('Role is not correct or you cannot register as admin');

  // ToDo: Verify Email with OTP

  const user = new User(body);
  await user.save();

  if (body.role === 'Doctor') {
    const newRequest = new Request({
      medicID: user._id
    });
    await newRequest.save();
  }

  return {
    status: StatusCodes.CREATED,
    message: 'User created successfully',
    result: user
  };
};

const logout = async (id: string) => {
  await delRedis(id);

  return {
    status: StatusCodes.OK,
    message: 'Logout successful'
  };
};

const changePassword = async (id: string, body: any) => {
  const { oldPassword, newPassword } = body;
  if (!oldPassword || !newPassword)
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Old password and new password are required');

  const user = await User.findById(id).select('+password');
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  const isCorrect: boolean = user.isCorrectPassword!(oldPassword);
  if (!isCorrect) throw new HttpError(StatusCodes.UNAUTHORIZED, 'Incorrect password');

  user.password = newPassword;
  await user.save();

  return {
    status: StatusCodes.OK,
    message: 'Password changed successfully',
    result: user
  };
};

const forgotPassword = async (body: any) => {
  const { email } = body;

  const user = await User.findOne({ email }).select('email');
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'Email not found');

  // 6 digits OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  putRedis(`${user._id}_otp`, otp);
  sendResetPasswordEmail(user.email, otp);

  return {
    status: StatusCodes.OK,
    message: 'OTP is sent to your email'
  };
};

const verifyOTP = async (body: any) => {
  const { otp, email } = body;
  if (!otp || !email) throw new HttpError(StatusCodes.BAD_REQUEST, 'OTP and email are required');

  const user = await User.findOne({ email }).select('email');
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'Email not found');

  const savedOTP = await getRedis(`${user._id}_otp`);
  if (savedOTP != otp) throw new HttpError(StatusCodes.UNAUTHORIZED, 'Incorrect OTP');

  return {
    status: StatusCodes.OK,
    message: 'OTP verified successfully'
  };
};

const resetPassword = async (body: any) => {
  const { email, newPassword } = body;
  if (!email || !newPassword) throw new HttpError(StatusCodes.BAD_REQUEST, 'Email and new password are required');

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  user.password = newPassword;
  await user.save();

  return {
    status: StatusCodes.OK,
    message: 'Password changed successfully',
    result: user
  };
};

export { login, register, logout, changePassword, forgotPassword, verifyOTP, resetPassword };
