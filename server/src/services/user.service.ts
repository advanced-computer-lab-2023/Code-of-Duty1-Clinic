import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';
import { User, Patient, Doctor, Pharmacist, Admin } from '../models';

const updateInfo = async (id: string, info: any) => {
  const canUpdate = ['email', 'hourRate', 'hospital'];
  // for (const field in info)
  //   if (!canUpdate.includes(field)) throw new HttpError(StatusCodes.BAD_REQUEST, 'You cannot update these fields');

  console.log(info, "****");
  let user:any = Doctor;
  if (info.role === 'Patient') user = Patient;
  else if (info.role === 'Doctor') user = Doctor;
  else if (info.role === 'Pharmacist') user = Pharmacist;
  else if (info.role === 'Admin') user = Admin;
  const updatedUser = await user.findByIdAndUpdate(id, info, { new: true });
  if (!updatedUser) throw new HttpError(StatusCodes.NOT_FOUND, 'the user does not exist');
console.log(updatedUser,"----");
  
  return {
    status: StatusCodes.OK,
    messsage: 'the user updated successfully',
    user: updatedUser
  };
};

const getUsers = async (query: Object) => {
  const users = await User.find({ ...query });
  if (!users) throw new HttpError(StatusCodes.NOT_FOUND, 'no users found');

  return {
    status: StatusCodes.OK,
    result: users
  };
};
const addNewDeliveryAddress = async (id: string, address: string) => {
  const patient = await Patient.findById(id);
  if (!patient) throw new HttpError(StatusCodes.NOT_FOUND, 'no such a user exist ');
  if (!address)
    return {
      status: StatusCodes.OK,
      result: patient.addresses
    };

  patient.addresses!.push(address);
  await patient.save();

  // patient.updateOne({ addresses: addresses });
  // console.log('i got there by the way and i finished my job');
  // await patient.save();
  // console.log('patient has been saved ');
  return {
    status: StatusCodes.OK,
    result: patient.addresses
  };
};

const viewWallet = async (userID: string, role: string) => {
  if (!['Patient', 'Doctor', 'Pharmacist'].includes(role))
    throw new HttpError(StatusCodes.NOT_FOUND, `User cannot have a wallet`);

  const user = await User.findById(userID);
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, `User not found`);

  return {
    result: (user as any).wallet,
    status: StatusCodes.OK,
    message: `Successfully retrieved user's wallet`
  };
};

const updateWallet = async (userID: string, role: string, amount: number) => {
  if (!['Patient', 'Doctor', 'Pharmacist'].includes(role))
    throw new HttpError(StatusCodes.NOT_FOUND, `User cannot have a wallet`);

  const user = await User.findById(userID);
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, `User not found`);

  (user as any).wallet += amount;
  if ((user as any).wallet < 0) throw new HttpError(StatusCodes.BAD_REQUEST, `Insufficient funds`);

  await user.save();

  return {
    result: (user as any).wallet,
    status: StatusCodes.OK,
    message: `Successfully updated user's wallet`
  };
};

export { updateInfo, getUsers, addNewDeliveryAddress, viewWallet, updateWallet };
