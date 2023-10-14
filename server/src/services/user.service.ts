import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';
import User from '../models/user.model';

const updateInfo = async (info: any) => {
  console.log('you got there ');
  if ('password' in info) throw new HttpError(StatusCodes.FORBIDDEN, "you can't modify the password");
  if ('role' in info) throw new HttpError(StatusCodes.FORBIDDEN, "you can't change the role ");
  const id = '6526cc9fd7b1d5b1a5c237b8';
  const updatedUser = await User.findByIdAndUpdate({ _id: id }, info);
  if (!updatedUser) throw new HttpError(StatusCodes.NOT_FOUND, 'the user does not exist');
  return {
    status: StatusCodes.OK,
    messsage: 'the user updated successfully',
    user: updatedUser
  };
};

const getUsers = async (query: Object) => {
  const users = await User.find(query).select('-password');
  if (!users) throw new HttpError(StatusCodes.NOT_FOUND, 'no users found');

  return {
    status: StatusCodes.OK,
    result: users
  };
};

export { updateInfo, getUsers };
