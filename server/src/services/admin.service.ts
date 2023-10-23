import { StatusCodes } from 'http-status-codes';
import { Doctor, Admin, Request, User } from '../models';
import { HttpError } from '../utils';

const getRequests = async (query: Object) => {
  let requests = await Request.find(query).populate('medicID');
  if (!requests) throw new HttpError(StatusCodes.NOT_FOUND, 'no requests found');

  return {
    status: StatusCodes.OK,
    result: requests
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

const deleteUsers = async (query: any) => {
  const users = await User.deleteMany(query);

  return {
    message: 'user has been deleted successfully',
    status: StatusCodes.OK,
    result: users
  };
};

export { getRequests, addAdmin, deleteUsers };
