import UserModel, { IPatient, IUserDocument, IDoctor } from '../models/user.model';
import { HttpError } from '../utils';
import StatusCodes from 'http-status-codes';
import mongoose, { Document } from 'mongoose';
import AppointmentModel from '../models/appointment.model';
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
const getPatients = async (doctorID: string) => {
  //get patients that have appointments with this doctor
  const patients = await AppointmentModel.find({ doctorID }).select('patientID').populate('patientID');
  if (!patients) {
    return {
      status: StatusCodes.NOT_FOUND,
      message: 'No patient',
      result: null
    };
  }
  return {
    status: StatusCodes.OK,
    message: 'Patients retrieved successfully',
    result: patients
  };
};

//select a patient from the list of patients
const selectPatient = async (doctorID: string, patientID: string) => {
  //get patients that have appointments with this doctor
  const patients = await AppointmentModel.find({ doctorID }).select('patientID').populate('patientID');
  const patient = patients.find((patient: any) => patient._id.toString() === patientID);
  //check if there is no patient with this id throw an error
  if (!patient) {
    return {
      status: StatusCodes.NOT_FOUND,
      message: 'No patient with this id',
      result: null
    };
  }
  return {
    status: StatusCodes.OK,
    message: 'Patient selected successfully',
    result: patient
  };
};

const getAllDoctor = async (doctorName?: string, specialty?: string, date?: Date) => {
  try {
    let nameFilter = doctorName ? getNameFilter(doctorName) : null;
    let specialtyFilter = specialty ? { specialty: specialty.trim().toLowerCase() } : null;
    let dateFilter = date ? getDateFilter(date) : null;
    let filter = { role: 'Doctor' };
    if (nameFilter) {
      filter = { ...filter, ...nameFilter };
    }
    if (specialty) {
      filter = { ...filter, ...specialtyFilter };
    }
    if (date) {
      filter = { ...filter, ...dateFilter };
    }
    // TODO spread operation (...) uses shallow clone a deep clone may be considered
    const doctors = await UserModel.find(filter, {
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
    }).populate({ path: 'contract', select: 'markUpProfit' });
    interface temp {
      markUpProfit: number;
    }
    return { result: doctors as (IDoctor & Document & temp)[] };
  } catch (error) {
    throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error happened while retrieving Doctors ');
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
          $or: [
            { 'name.first': { $regex: names[0], $options: 'i' } },
            { 'name.middle': { $regex: names[1], $options: 'i' } }
          ]
        },
        {
          $or: [
            { 'name.first': { $regex: names[0], $options: 'i' } },
            { 'name.last': { $regex: names[1], $options: 'i' } }
          ]
        },
        {
          $or: [
            { 'name.middle': { $regex: names[0], $options: 'i' } },
            { 'name.last': { $regex: names[1], $options: 'i' } }
          ]
        }
      ]
    };
  } else if (names.length == 1) {
    nameFilter = [
      {
        $or: [
          { 'name.first': { $regex: names[0], $options: 'i' } },
          { 'name.middle': { $regex: names[0], $options: 'i' } },
          { 'name.last': { $regex: names[0], $options: 'i' } }
        ]
      }
    ];
  }

  return nameFilter;
};

const getDateFilter = (date: Date) => {
  let filter = null;
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = daysOfWeek[date.getDay()];
  const hours = date.getHours();
  const minutes = date.getMinutes;
  filter = {
    $and: [
      { [`weeklySlots.${day}`]: { $exists: true } },
      {
        $or: [
          { [`weeklySlots.${day}.from.hours`]: { $lt: hours } },
          {
            $and: [
              { [`weeklySlots.${day}.from.hours`]: { $eq: hours } },
              { [`weeklySlots.${day}.from.minutes`]: { $lte: minutes } }
            ]
          }
        ]
      },
      {
        $or: [
          { [`weeklySlots.${day}.to.hours`]: { $gt: hours } },
          {
            $and: [
              { [`weeklySlots.${day}.to.hours`]: { $eq: hours } },
              { [`weeklySlots.${day}.to.minutes`]: { $gte: minutes } }
            ]
          }
        ]
      }
    ]
  };

  return filter;
};
export { getAllDoctor, getPatients, selectPatient };
