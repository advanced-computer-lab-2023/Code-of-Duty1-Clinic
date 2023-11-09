import { StatusCodes } from 'http-status-codes';
import { User, Patient, IPatient, IDoctor, Package, IPackage, FamilyMember } from '../models';
import { getDoctors } from './doctor.service';
import { HttpError } from '../utils';
import { Prescription, Appointment } from '../models';

const addFamilyMember = async (id: string, body: any) => {
  let userID;
  if(body.userID)
    userID = body.userID;

  if(body.email)
    userID = await Patient.findOne({email:body.email}).select('_id');

  if(body.phone)
    userID = await Patient.findOne({phone:body.phone}).select('_id');

  const { relation, name, age, gender, nationalID } = body;
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

const getPatientHealthPackage = async (userID: string) => {

  const user = await Patient.findOne({ _id: userID });

  if(user?.package)
  {

    if(user?.package.packageStatus === 'Subscribed')
    {

      const userPackage = await Package.findOne({_id:user?.package.packageID}).select('-_id -isLatest');
  
      let renewalDate = user?.package.endDate as Date;
      renewalDate.setDate(renewalDate.getDate() + 1); 
  
      return {
  
        status: StatusCodes.OK,
        userPackage: userPackage,
        packageStatus:"Subscribed",
        renewalDate: renewalDate
  
      }

    }

    if(user?.package.packageStatus === 'Cancelled')
    {

      return {
  
        status: StatusCodes.OK,
        packageStatus: 'Cancelled',
        endDate: user?.package.endDate
  
      }

    }
  }

  return {

    status: StatusCodes.OK,
    message: "You are not subscribed to a health package",
    packageStatus: "UnSubscribed"

  };
};

const cancelSubscribtion = async (userID: string) => {

  const user = (await Patient.findOne({ _id: userID }));

  if (!(user?.package) || !(user.package.packageStatus === 'Subscribed')) 
    throw new HttpError(StatusCodes.BAD_REQUEST, "You're not subscribed to any Health package");
  
  Patient.findByIdAndUpdate(userID, { $set: { 'package.packageStatus': 'Cancelled' } });

  return {

    status: StatusCodes.OK,
    message: 'Cancelled Subscribtion sucessfully'

  };
};

export {
  viewDoctorsForPatient as viewAllDoctorsForPatient,
  getFamily,
  addFamilyMember,
  getPatientHealthPackage,
  cancelSubscribtion
};
