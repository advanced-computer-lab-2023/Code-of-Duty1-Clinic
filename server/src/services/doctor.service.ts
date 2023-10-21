import { HttpError } from '../utils';
import StatusCodes from 'http-status-codes';
import mongoose, { Document } from 'mongoose';
import AppointmentModel from '../models/appointment.model';
import Contract from '../models/contract.model';
import UserModel, { IPatient, IUserDocument, IDoctor, DailySchedule } from '../models/user.model';
const selectDoctor = async (doctorID: string) => {
  // Use Mongoose to find the doctor by ID
  const doctor = await UserModel.findById(doctorID);

  // Check if the doctor was found
  if (!doctor) {
    return {
      status: StatusCodes.NOT_FOUND,
      message: 'No doctor with this ID',
      result: null
    };
  }

  return {
    status: StatusCodes.OK,
    message: 'Doctor selected successfully',
    result: doctor
  };
};

interface PatientQuery {
  name:
    | string
    | {
        first: string;
        middle: string;
        last: string;
      };
}
//this method takes the doctor id and the req.query
const getPatients = async (doctorID: string, query: PatientQuery) => {
  //get patients that have appointments with this doctor
  if (query.name && typeof query.name === 'string') {
    // Convert the string name query into an object with first, middle, and last properties
    const nameParts = query.name.split(' ');
    query.name = {
      first: nameParts[0] || '',
      middle: nameParts[1] || '',
      last: nameParts[2] || ''
    };
    // console.log(query);
    const patients = await AppointmentModel.find({ doctorID }).select('patientID startTime');
    const IDs: mongoose.Schema.Types.ObjectId[] = [];
    patients.forEach((patient) => {
      IDs.push(patient.patientID);
    });
    // console.log(IDs);
    const filteredPatients = await UserModel.find({ _id: { $in: IDs }, name: query.name });
    // console.log(filteredPatients);
    return {
      status: StatusCodes.OK,
      message: 'Patients retrieved successfully4',
      result: filteredPatients
    };
  }

  const patients = await AppointmentModel.find({ doctorID }).find(query).select('patientID').populate('patientID');

  if (!patients) {
    return new HttpError(StatusCodes.NOT_FOUND, 'No patients with this doctor');
  }
  return {
    status: StatusCodes.OK,
    message: 'Patients retrieved successfully',
    result: patients
  };
};

//select a patient from the list of patients
const selectPatient = async (doctorID: string, patientID: string) => {
  //get patient that have appointments with this doctor and matches the patient id
  const patient = await AppointmentModel.find({ doctorID, patientID }).select('patientID').populate('patientID');
  //check if there is no patient with this id throw an error
  if (!patient) {
    return new HttpError(StatusCodes.NOT_FOUND, 'No patient with this ID');
  }
  return {
    status: StatusCodes.OK,
    message: 'Patient selected successfully',
    result: (patient as any)[0].patientID
  };
};

// const getDoctorDetails = async (doctorID: string) => {
//   try {
//     // Fetch the specific doctor by ID
//     const doctor = await UserModel.findOne({ _id: doctorID });

//     if (!doctor) {
//       return {
//         status: StatusCodes.NOT_FOUND,
//         message: 'Doctor not found',
//         result: null,
//       };
//     }

//     // Return the doctor's details
//     return {
//       status: StatusCodes.OK,
//       message: 'Doctor details',
//       result: {
//         name: doctor.name,
//         hourRate: doctor.hourRate,
//         hospital: doctor.hospital,
//         educationBackground: doctor.educationBackground,
//         specialty: doctor.specialty,
//       },
//     };
//   } catch (error) {
//     return {
//       status: StatusCodes.INTERNAL_SERVER_ERROR,
//       message: 'Error while fetching doctor details',
//       result: null,
//     };
//   }
// };

////////////////////////////////////////////////
const calculateTimeStamp = (slot: { hours: number; minutes: number }) => slot.hours * 60 + slot.minutes;
const getAllDoctor = async (query?: any) => {
  try {
    let nameFilter = query?.name ? getNameFilter(query.name) : null;
    let specialtyFilter = query?.specialty ? { specialty: query.specialty.trim().toLowerCase() } : null;

    let filter = { role: 'Doctor' };
    filter = { ...filter, ...(nameFilter || {}), ...(specialtyFilter || {}), role: 'Doctor' };

    const doctors: IDoctor[] = await UserModel.find(filter, {
      contractID: 1,
      name: 1,
      specialty: 1,
      weeklySlots: 1,
      hourRate: 1,
      hospital: 1,
      vacations: 1,
      gender: 1,
      phone: 1,
      addresses: 1,
      profileImage: 1,
      _id: 1
    }).populate({
      path: 'contractID',
      model: Contract
    });
    console.log(doctors);
    if (query?.date) {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const day: string = daysOfWeek[query.date.getDay()];
      const hours = query.date.getHours();
      const minutes = query.date.getMinutes();
      const inputTimeStamp = 60 * hours + minutes;
      doctors.filter((doctor) => {
        const slots = (doctor!.weeklySlots as Record<string, DailySchedule[]>)[day];

        for (let j = 0; j < slots.length; j++) {
          const slot = slots[j];
          const fromTimeStamp = calculateTimeStamp(slot.from);
          const toTimeStamp = calculateTimeStamp(slot.to);
          return inputTimeStamp >= fromTimeStamp && inputTimeStamp <= toTimeStamp;
        }
      });
    }
    interface markUpProfitType {
      contractID: { markUpProfit: number };
    }
    // doctors.forEach((e) => {
    //   console.log((e as any).contractID);
    // });

    return { result: doctors as any[], status: StatusCodes.OK };
  } catch (error) {
    throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error happened while retrieving Doctors' + error);
  }
};

const getNameFilter = (doctorName: string): object | null => {
  const names = doctorName.trim().toLowerCase()?.split(' ');
  var nameFilter = null;
  if (names.length >= 3) {
    nameFilter = {
      'name.first': { $regex: names[0], $options: 'i' },
      'name.middle': { $regex: names[1], $options: 'i' },
      'name.last': { $regex: names[2], $options: 'i' }
    };
  } else if (names.length == 2) {
    nameFilter = {
      $or: [
        {
          'name.first': { $regex: names[0], $options: 'i' },
          'name.middle': { $regex: names[1], $options: 'i' }
        },
        {
          'name.first': { $regex: names[0], $options: 'i' },
          'name.last': { $regex: names[1], $options: 'i' }
        },
        {
          'name.middle': { $regex: names[0], $options: 'i' },
          'name.last': { $regex: names[1], $options: 'i' }
        }
      ]
    };
  } else if (names.length == 1) {
    nameFilter = {
      $or: [
        { 'name.first': { $regex: names[0], $options: 'i' } },
        { 'name.middle': { $regex: names[0], $options: 'i' } },
        { 'name.last': { $regex: names[0], $options: 'i' } }
      ]
    };
  }

  return nameFilter;
};

export { getAllDoctor, getPatients, selectPatient };
