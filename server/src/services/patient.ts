import UserModel, { IPatient, IUserDocument, IUser } from '../models/user.model';
import PackageModel, { IPackageDocument } from '../models/package.model';
import mongoose from 'mongoose';
import { getAllDoctorForGuest } from './doctor';
import { getPackageById } from './package';
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

    const doctors = await getAllDoctorForGuest();
    if (Array.isArray(doctors)) {
      for (const element of doctors) {
        element.hourRate = element.hourRate - (element.hourRate * sessionDiscount) / 100;
      }
    }
    return doctors;
  } catch (error) {
    console.error('Error retrieving patient or doctors:', error);
    return error;
  }
};

// Replace 'PackageModel' with the actual model name for the package if it's different.
// Also, ensure that you have the correct field name in your package model that references doctors.
