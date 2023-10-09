import UserModel, { IPatient, IUserDocument, IUser, IDoctor } from '../models/user.model';
import PackageModel, { IPackageDocument } from '../models/package.model';
import mongoose from 'mongoose';
import { getAllDoctor } from './doctor';
import { getPackageById } from './package';
import { HttpError } from '../utils';
import { StatusCodes } from 'http-status-codes';
const hasActivePackage = (patient: IPatient): Boolean => {
  if (patient.package && patient.package.packageID && patient.package.packageStatus) {
    if (patient.package.endDate && patient.package.endDate.getTime() > Date.now()) {
      return true;
    }
  }
  return false;
};
const getPatientByID = async (patientId: string) => {
  return UserModel.findOne({ _id: new mongoose.Types.ObjectId(patientId) });
};

const viewAllDoctorsForPatient = async (patientId: string) => {
  try {
    var sessionDiscount = 0;
    const patient: IUserDocument | null = await getPatientByID(patientId);
    const pkgID = (patient as IPatient)?.package?.packageID;
    const pkg: IPackageDocument | null = await getPackageById(pkgID!);
    sessionDiscount = pkg?.sessionDiscount || 0;

    const doctors: IUserDocument[] = (await getAllDoctor()).result;
    if (Array.isArray(doctors)) {
      for (let i = 0; i < doctors.length; i++) {
        let temp = doctors[i] as IDoctor;
        temp.hourRate = temp.hourRate - (temp.hourRate * sessionDiscount) / 100;
      }
    }

    return { result: doctors, status: StatusCodes.OK, message: 'R' };
  } catch (error) {
    console.error('Error retrieving patient or doctors:', error);
    throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error happened while retrieving Doctors');
  }
};

// Replace 'PackageModel' with the actual model name for the package if it's different.
// Also, ensure that you have the correct field name in your package model that references doctors.
