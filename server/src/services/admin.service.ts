import { StatusCodes } from 'http-status-codes';
import { Doctor, Admin, Request, User, Contract } from '../models';
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
  let admin;
  let message = 'new admin has been created';
  let status = StatusCodes.OK;

  try {
     admin = new Admin(adminInfo);
    await admin.save();
  } catch (e) { 
      message = (e as Error).message;
      status = StatusCodes.CONFLICT;
  }  return {
    message: message,
    status: status,
    result: admin
  };
};

const deleteUsers = async (query: any) => {
  const users = await User.deleteMany(query);

  // if case of all admins deleted, staticlly add admin to users collection
  const admin = await Admin.findOne({ username: 'admin' });
  if (!admin) {
    const staticAdmin = new Admin({
      username: 'admin',
      password: 'password',
      name: 'admin',
      email: 'admin@example.com',
      phone: '01000000000'
    });
    await staticAdmin.save();
  }

  return {
    message: 'user has been deleted successfully',
    status: StatusCodes.OK,
    result: users
  };
};

const acceptRequest = async (email: string) => {
  const doctor = await User.findOne({ email });
  if (!doctor) throw new HttpError(StatusCodes.NOT_FOUND, 'Doctor not found');

  const request = await Request.findOneAndUpdate({ medicID: doctor._id }, { status: 'Approved' });
  if (!request) throw new HttpError(StatusCodes.NOT_FOUND, 'Request not found');
  if (request.status !== 'Pending') throw new HttpError(StatusCodes.BAD_REQUEST, 'Request is handled before');

  let endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  const contract = new Contract({
    doctorID: doctor._id,
    startDate: new Date(),
    endDate,
    markUpProfit: 15
  });
  await contract.save();

  return {
    status: StatusCodes.OK,
    message: 'Doctor approved successfully',
    result: request
  };
};

const rejectRequest = async (email: string) => {
  const doctor: any = await User.findOne({ email: email });
  if (!doctor) throw new HttpError(StatusCodes.NOT_FOUND, 'Doctor not found');

  const request = await Request.findOne({ medicID: doctor._id });
  if (!request) throw new HttpError(StatusCodes.NOT_FOUND, 'Request not found');
  if (request.status !== 'Pending') throw new HttpError(StatusCodes.BAD_REQUEST, 'Request is handled before');
  request.status = 'Rejected';
  await request.save();

  return {
    status: StatusCodes.OK,
    message: 'Doctor rejected successfully',
    result: request
  };
};

export { getRequests, addAdmin, deleteUsers, acceptRequest, rejectRequest };
