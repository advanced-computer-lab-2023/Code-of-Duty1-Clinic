import { StatusCodes } from 'http-status-codes';
import { User, Patient, IPatient, IDoctor, Package, IPackage, FamilyMember } from '../models';
import { getDoctors } from './doctor.service';
import { HttpError } from '../utils';
import { Prescription, Appointment } from '../models';
import path from 'path';
import fs from 'fs';
// Maybe we need to validate unique family member by userID or nationalID
const addFamilyMember = async (id: string, body: any) => {
  let userID;
  if(body.userID)
    userID = body.userID;

  if(body.email)
  {
    userID = await Patient.findOne({email:body.email}).select('_id');
    let userID2  = userID?._id.toString();
    if(userID2 === id)
    {
      throw new HttpError(StatusCodes.BAD_REQUEST,'Please enter an Email other than your Email')
    }
  }

  if(body.phone)
  {
    userID = await Patient.findOne({phone:body.phone}).select('_id');
    let userID2  = userID?._id.toString();
    if(userID2 === id)
    {
      throw new HttpError(StatusCodes.BAD_REQUEST,'Please enter a Phone Number other than your Phone Number')
    }
  }

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
      'Either name, nationalID, gender, age, and relation should be provided, or userID or email or phone and relation should be provided.'
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
const getMedicalHistory = async (patientID: String) => { 
  const result = await Patient.findOne({ _id: patientID }).select("medicalHistory -_id -role").lean();
  if (!result)
    throw new HttpError(StatusCodes.NOT_FOUND, "not found");
  console.log(result);
  return {
    result: result["medicalHistory"],
    status: StatusCodes.OK,
    message: 'Successfully retrieved medical history'
  }

}
const resolveURL = (url: string) => { 
  const parentURL = path.dirname(__dirname);
  url = path.join(parentURL, url!);
  return url;
}
const getMedicalHistoryURL = async (body: any) => {
  let result = await Patient.findOne({ _id: body._id }).select("medicalHistory").lean();
  if (!result)
    throw new HttpError(StatusCodes.NOT_FOUND, "not found");
  let records = result!["medicalHistory"];
  let url = null;
  for (let i = 0; i < records!.length; i++) {
    if (records![i]["name"] == body.recordName) {
      url = records![i]["medicalRecord"];
      break;
    }
  }
  

  return resolveURL(url!);
  
}
const saveMedicalHistory = async (patientID:string,files:Express.Multer.File[]) => { 

  let insertedRecords = [];
  for (let i = 0; i < files.length; i++) {
    const idx = files[i].path.indexOf("uploads");
    const filePath = files[i].path.slice(idx);
      // path.join("..",);
    const name = files[i].filename;
     const medicalHistory = {
      name,
      medicalRecord: filePath, 
    };
    const result = await Patient.findOneAndUpdate(
      { _id: patientID },
      { $push: { medicalHistory: medicalHistory } },
      { new: true }
    );
    insertedRecords.push(result);
  }
  return {
    result: insertedRecords,
    status: StatusCodes.OK,
    message: 'Successfully inserted medical records'

  }

}
const removeMedicalHistory = async (patientID: string, recordName: string) => { 
  
  const record = await Patient.findOneAndUpdate({ _id: patientID },
    {
      $pull: {
        medicalHistory: { name: recordName }
      }
    }, { new: false });
  if (!record) throw new HttpError(StatusCodes.NOT_FOUND, 'Record not found');
  let filePath = null;
  for (let i = 0; i < record!.medicalHistory!.length;i++) {
    const ele = record!.medicalHistory![i];

    if ((ele).name == recordName) {
     
      filePath = (ele).medicalRecord;
      break;
    }
  }
  if(!filePath)throw new HttpError(StatusCodes.NOT_FOUND, 'Record not found');
  filePath = path.resolve(__dirname, "../" + filePath);
  fs.unlink(filePath,(e)=>e);
  
  return {
    result: filePath,
    status: StatusCodes.OK,
    message: 'Successfully deleted medical record'
  };
}

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

const getHealthPackage = async (userID: string) => {

  const user = await Patient.findOne({ _id: userID });

  if(user?.package)
  {

    if(user?.package.packageStatus === 'Subscribed')
    {

      const userPackage = await Package.findOne({_id:user?.package.packageID}).select('-_id -isLatest');
  
      let renewalDate = user?.package.endDate as Date;
      renewalDate.setDate(renewalDate.getDate() + 1); 
  
      return{
  
        status: StatusCodes.OK,
        userPackage: userPackage,
        packageStatus:"Subscribed",
        renewalDate: renewalDate
  
      }

    }

    if(user?.package.packageStatus === 'Cancelled')
    {

      return{
  
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

const cancelSubscribtion = async(userID:string) => {

  const user = await Patient.findById(userID);

  if(!(user?.package))
  {
    throw new HttpError(StatusCodes.BAD_REQUEST,"You're not subscribed to any packages");
  }

  await Patient.findByIdAndUpdate(userID, { $set: { 'package.packageStatus': 'Cancelled' } });

  return {

    status: StatusCodes.OK,
    message: 'Cancelled Subscribtion sucessfully'

  };

};

const subscribe = async( userID:string, packageID:string) =>
{
  let date = new Date();
  date.setFullYear(date.getFullYear()+1);

  const userPackage = {
    packageID: packageID,
    packageStatus: 'Subscribed',
    endDate: date
  }
  

  await Patient.findByIdAndUpdate(userID, {$set: {package: userPackage}});

  return {

    status: StatusCodes.OK,
    message: 'Subscribed sucessfully'

  };
}


export {
  viewDoctorsForPatient as viewAllDoctorsForPatient,
  getFamily,
  addFamilyMember,
  addHealthRecord,
  getHealthRecords,
  saveMedicalHistory,
  removeMedicalHistory,
  getMedicalHistoryURL,
  getMedicalHistory,
  getHealthPackage,
  cancelSubscribtion,
  subscribe
};
