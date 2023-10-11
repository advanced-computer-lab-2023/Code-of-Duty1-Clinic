import UserModel, { IPatient, IUserDocument, IUser, IDoctor } from '../models/user.model';
import PackageModel, { IPackageDocument } from '../models/package.model';
import mongoose, { Document } from 'mongoose';
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

const viewAllDoctorsForPatient = async (patientId: string, doctorName?: string, specialty?: string, date?: Date) => {
  try {
    var sessionDiscount = 0;
    const patient: IUserDocument | null = await getPatientByID(patientId);
    const pkgID = (patient as IPatient)?.package?.packageID;
    const pkg: IPackageDocument | null = await getPackageById(pkgID!);
    sessionDiscount = pkg?.sessionDiscount || 0;

    let doctors = (await getAllDoctor(doctorName, specialty, date)).result;
    if (!Array.isArray(doctors)) {
      doctors = [doctors];
    }

    for (let i = 0; i < doctors.length; i++) {
      doctors[i].hourRate = calculateFinalSessionPrice(doctors[i].hourRate, doctors[i].markUpProfit, sessionDiscount);
    }

    return {
      result: doctors,
      status: StatusCodes.OK,
      message: 'Successfully retrieved Doctors'
    };
  } catch (error) {
    console.error('Error retrieving patient or doctors:', error);
    throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error happened while retrieving Doctors');
  }
};

const calculateFinalSessionPrice = (
  doctorHourRate: number,
  markupProfit: number,
  sessionDiscountPercentage: number = 0
): number => {
  let price = doctorHourRate + 0.1 * markupProfit;
  let finalPrice = price - price * sessionDiscountPercentage;
  return finalPrice;
};

export { viewAllDoctorsForPatient };
