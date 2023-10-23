import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';
import { User } from '../models';

const updateInfo = async (id: string, info: any) => {
  if (info.password || info.role) throw new HttpError(StatusCodes.FORBIDDEN, "you can't modify these fields");

  const updatedUser = await User.findByIdAndUpdate(id, info);
  if (!updatedUser) throw new HttpError(StatusCodes.NOT_FOUND, 'the user does not exist');
  return {
    status: StatusCodes.OK,
    messsage: 'the user updated successfully',
    user: updatedUser
  };
};

const getUsers = async (query: Object) => {
  const users = await User.find(query);
  if (!users) throw new HttpError(StatusCodes.NOT_FOUND, 'no users found');

  return {
    status: StatusCodes.OK,
    result: users
  };
};

export { updateInfo, getUsers };
