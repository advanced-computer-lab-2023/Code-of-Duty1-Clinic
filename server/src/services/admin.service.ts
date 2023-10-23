import { StatusCodes } from 'http-status-codes';
import { Doctor, Admin, Request, User } from '../models';
import { HttpError } from '../utils';

const getRequests = async (query: Object) => {
  let users = await Doctor.find(query).populate({
    path: 'request',
    model: Request
  });
  users = users.filter((user: any) => user.request.length > 0);
  if (!users) throw new HttpError(StatusCodes.NOT_FOUND, 'no users found');

  return {
    status: StatusCodes.OK,
    result: users
  };
};

const addAdmin = async (adminInfo: any) => {
  const admin = new Admin(adminInfo);
  await admin.save();

  return {
    message: 'new admin has been created',
    status: StatusCodes.OK,
    result: admin
  };
};

const deleteUser = async (id: string) => {
  const users = await User.findByIdAndDelete(id);

  return {
    message: 'user has been deleted successfully',
    status: StatusCodes.OK,
    result: users
  };
};

export { getRequests, addAdmin, deleteUser };
