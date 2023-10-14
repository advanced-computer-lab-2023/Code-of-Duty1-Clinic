import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';
import User from '../models/user.model';

const updateInfo = async (info: any) => {
  console.log(info);
  const id = info.id;
  if ('password' in info) throw new HttpError(StatusCodes.FORBIDDEN, "you can't modify the password");
  if ('role' in info) throw new HttpError(StatusCodes.FORBIDDEN, "you can't change the role ");
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
const addAdmin = async (adminInfo: object) => {
  const admin = new User({ ...adminInfo, role: 'Administrator' });
  await admin.save();
  return {
    message: 'new admin has been created',
    status: StatusCodes.OK,
    result: admin
  };
};
const deleteUsers = async () => {
  await User.deleteMany();
  return {
    message: 'users have been deleted successfully',
    status: StatusCodes.OK,
    result: null
  };
};
const deleteUser = async (id: String) => {
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) throw new HttpError(StatusCodes.NOT_FOUND, 'there is no such a user to delete');
  return {
    message: `${deletedUser.name} has been been deleted `,
    status: StatusCodes.OK,
    result: deletedUser
  };
};

export { updateInfo, getUsers, addAdmin, deleteUsers, deleteUser };
