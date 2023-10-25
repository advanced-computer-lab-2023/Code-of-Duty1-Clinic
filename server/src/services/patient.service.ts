import { StatusCodes } from 'http-status-codes';
import { User, Patient, IPatient, IDoctor, Package, IPackage } from '../models';
import { getDoctors } from './doctor.service';
import { HttpError } from '../utils';
import { Prescription, Appointment } from '../models';

// Maybe we need to validate unique family member by userID or nationalID
const addFamilyMember = async (id: string, body: any) => {
  const { relation, userID, name, age, gender, nationalID } = body;
  if (!id || !relation) throw new HttpError(StatusCodes.BAD_REQUEST, 'Please provide id, relation');

  let newFamily;
  if (userID) {
    const familyUser = await Patient.findById(userID);
    if (!familyUser) throw new HttpError(StatusCodes.NOT_FOUND, "User's new family member not found");

    newFamily = { relation, userID };
  } else if (name && age && gender && nationalID) {
    newFamily = {
      relation,
      name,
      nationalID,
      age,
      gender
    };
  } else {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'Either name, nationalID, gender, age, and relation should be provided, or userID and relation should be provided.'
    );
  }

  const update = {
    $push: {
      family: newFamily
    }
  };
  const updatedUser = await Patient.findOneAndUpdate({ _id: id }, update, { new: true });
  if (!updatedUser) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  return {
    result: updatedUser,
    status: StatusCodes.OK,
    message: 'Family member added successfully'
  };
};

const getFamily = async (patientID: string) => {
  const user: any = await Patient.findOne({
    _id: patientID
  }).select('family');
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'patient not found');

  const family = user.family;
  if (!family) throw new HttpError(StatusCodes.NOT_FOUND, 'family not found');

  family.forEach(async (member: any) => {
    let info = { ...member.toObject() };
    if (member.userID) {
      const populateInfo = await Patient.findById(member.userID).select('name gender phone');
      info = { ...info, ...populateInfo?.toObject() };
    }

    return info;
  });

  return {
    result: family,
    status: StatusCodes.OK,
    message: 'Family members retrieved successfully'
  };
};

const viewDoctorsForPatient = async (patientId: string, query: any) => {
  const patient: IPatient | null = await Patient.findOne({ _id: patientId });
  if (!patient) throw new HttpError(StatusCodes.NOT_FOUND, 'Patient not found');

  let sessionDiscount = 0;
  if (patient.package) {
    const pkg = await Package.findOne({ _id: patient.package.packageID });
    if (pkg && patient.package!.endDate?.getTime() >= Date.now()) sessionDiscount = pkg.sessionDiscount;
  }

  // ToDO: doctors who accepted their contract only should appear
  let doctors = (await getDoctors(query)).result;

  for (let i = 0; i < doctors.length; i++) {
    const { hourRate, contract } = doctors[i];

    let price = hourRate * (1 + contract?.markUpProfit!);
    doctors[i].hourRate = price - price * (sessionDiscount / 100);
  }

  return {
    result: doctors,
    status: StatusCodes.OK,
    message: 'Successfully retrieved Doctors'
  };
};

const addHealthRecord = async (patientID: String, body: any) => {
  const { name, medicalRecord } = body;
  if (!name || !medicalRecord) throw new HttpError(StatusCodes.BAD_REQUEST, 'Please provide name, medicalRecord');

  const update = {
    $push: {
      medicalHistory: {
        name,
        medicalRecord
      }
    }
  };
  const updatedUser = await Patient.findByIdAndUpdate(patientID, update, { new: true });
  if (!updatedUser) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  return {
    result: updatedUser,
    status: StatusCodes.OK,
    message: 'Health record added successfully'
  };
};

const getHealthRecords = async (patientID: String) => {
  const user: any = await Patient.findById(patientID).select('medicalHistory');
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'patient not found');

  const healthRecords = user.medicalHistory;
  if (!healthRecords) throw new HttpError(StatusCodes.NOT_FOUND, 'health records not found');

  return {
    result: healthRecords,
    status: StatusCodes.OK,
    message: 'Health records retrieved successfully'
  };
};

export {
  viewDoctorsForPatient as viewAllDoctorsForPatient,
  getFamily,
  addFamilyMember,
  addHealthRecord,
  getHealthRecords
};
