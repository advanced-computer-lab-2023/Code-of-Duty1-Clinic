import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';
import { User, Request, Admin, Doctor } from '../models';

const updateInfo = async (info: any) => {
  const { id } = info;
  delete info.id;
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

const getDoctorsRequests = async (query: Object) => {
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

const deleteUsers = async (body: any) => {
  const users = await User.deleteMany(body);

  return {
    message: 'users have been deleted successfully',
    status: StatusCodes.OK,
    result: users
  };
};

export { updateInfo, getUsers, addAdmin, deleteUsers, getDoctorsRequests };
