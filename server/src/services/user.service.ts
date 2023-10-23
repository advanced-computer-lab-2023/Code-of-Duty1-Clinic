import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';
import { User } from '../models';

const updateInfo = async (id: string, info: any) => {
  const canUpdate = ['email', 'hourRate', 'hospital'];
  for (const field in info)
    if (!canUpdate.includes(field)) throw new HttpError(StatusCodes.BAD_REQUEST, 'You cannot update these fields');

  const updatedUser = await User.findByIdAndUpdate(id, info, { new: true });
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
