import UserModel, { IPatient, IUserDocument, IUser, IDoctor, FamilyMember } from '../models/user.model';
import PackageModel, { IPackageDocument } from '../models/package.model';
import mongoose, { Document } from 'mongoose';
import { getAllDoctor } from './doctor.service';
import { getPackageById } from './package.service';
import { HttpError } from '../utils';
import { StatusCodes } from 'http-status-codes';
import PrescriptionModel from '../models/prescription.model';
const hasActivePackage = (patient: (IPatient & Document) | IPatient): Boolean => {
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

const addUserFamilyMember = async (patientID: string, userID: string, relation: string) => {
  const filter = { _id: patientID };
  const update = {
    userID: new mongoose.Types.ObjectId(userID),
    relation: relation
  };

  const updatedUser = await UserModel.findOneAndUpdate(filter, update, { new: true })
    .then((user) => user)
    .catch((e) => {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, `Unable to add the family member${e}`);
    });
  return {
    result: updatedUser,
    status: StatusCodes.OK,
    message: 'family member added successfully'
  };
};
const getFamily = async (patientID: string) => {
  try {
    const family = await UserModel.find({
      _id: new mongoose.Types.ObjectId(patientID)
    }).select({
      family: 1
    });
    let result = [];
    for (const member of family as unknown as FamilyMember[]) {
      let memberResult = { ...(member as any).toObject() };
      if (memberResult.userID) {
        const memberInfo = await UserModel.findById(memberResult.userID as mongoose.Types.ObjectId).select({
          name: 1,
          birthDate: 1,
          gender: 1,
          phone: 1
        });
        memberResult = { ...memberResult, ...memberInfo!.toObject() };
        delete memberResult.userID;
      }
      result.push(memberResult);
    }
    return {
      result: result,
      status: StatusCodes.OK,
      message: 'Family members retrieved successfully'
    };
  } catch (e) {
    throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, `Unable to add the family member${e}`);
  }
};
const addNonUserFamilyMember = async (
  patientID: string,
  memberName: string,
  nationalID: string,
  birthDate: Date,
  gender: string,
  relation: string
) => {
  const filter = { _id: new mongoose.Types.ObjectId(patientID) };
  const update = {
    name: memberName,
    nationalID: nationalID,
    birthDate: birthDate,
    gender: gender,
    relation: relation
  };

  const updatedUser = await UserModel.findOneAndUpdate(filter, update, { new: true })
    .then((user) => user)
    .catch((e) => {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, `Unable to add the family member${e}`);
    });
  return {
    result: updatedUser,
    status: StatusCodes.OK,
    message: 'family member added successfully'
  };
};
const viewAllDoctorsForPatient = async (patientId: string, doctorName?: string, specialty?: string, date?: Date) => {
  try {
    var sessionDiscount = 0;
    const patient: IUserDocument | null = await getPatientByID(patientId);
    const pkgID = (patient as IPatient)?.package?.packageID;
    const pkg: IPackageDocument | null = await getPackageById(pkgID?.toString()!);
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

const getAllPrescription = async (patientID: string) => {
  const presecription = await PrescriptionModel.find({ patientID: patientID });
  return {
    status: StatusCodes.OK,
    message: 'here all presecription',
    result: presecription
  };
};

const filterPrescriptions = async (
  patientID: string,
  filterType: 'date' | 'doctor' | 'filled' | 'unfilled',
  filterValue: Date | string | boolean
) => {
  // Get all prescriptions first using getAllPrescription
  const allPrescriptions = await getAllPrescription(patientID);

  // Filter the prescriptions based on the selected filter type
  const filteredPrescriptions = allPrescriptions.result.filter((prescription) => {
    if (filterType === 'date' && prescription.dateIssued === filterValue) {
      return true;
    }
    if (filterType === 'doctor' && prescription.doctorID.toString() === filterValue) {
      return true;
    }
    if (filterType === 'filled' && prescription.isFilled === filterValue) {
      return true;
    }
    if (filterType === 'unfilled' && prescription.isFilled !== filterValue) {
      return true;
    }
    return false;
  });

  // Check if no prescriptions match the filter criteria
  if (filteredPrescriptions.length === 0) {
    return {
      status: StatusCodes.OK,
      message: `No prescriptions found for the selected ${filterType}`,
      result: []
    };
  }

  return {
    status: StatusCodes.OK,
    message: `Filtered prescriptions by ${filterType}`,
    result: filteredPrescriptions
  };
};

const selectPrescription = async (prescriptionID: string) => {
  try {
    // Fetch prescriptions for the given patient and doctor
    const prescriptions = await PrescriptionModel.find({ prescriptionID });

    if (!prescriptions || prescriptions.length === 0) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: 'No prescriptions found for the given patient and doctor',
        result: []
      };
    }

    // Return the prescriptions
    return {
      status: StatusCodes.OK,
      message: 'Prescriptions for the patient and doctor',
      result: prescriptions
    };
  } catch (error) {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error while fetching prescriptions',
      result: []
    };
  }
};
const getPatientHealthRecord = async (patientID: string) => {
  try {
    const result = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(patientID) }).select('medicalHistory');
    return {
      result: result,
      status: StatusCodes.OK,
      message: 'Successfully retrieved health record'
    };
  } catch (e) {
    throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, `Error happened while retrieving health record${e}`);
  }
};
export {
  viewAllDoctorsForPatient,
  calculateFinalSessionPrice,
  getAllPrescription,
  filterPrescriptions,
  selectPrescription,
  getFamily,
  hasActivePackage,
  getPatientHealthRecord
};
