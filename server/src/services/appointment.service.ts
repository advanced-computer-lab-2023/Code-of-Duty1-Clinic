import AppointmentModel from '../models/appointment.model';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { HttpError } from '../utils';
const getUpcomingPatients = async (doctorID: string) => {
  //get patients that have appointments with this doctor
  const patients = await AppointmentModel.find({ doctorID: doctorID }).distinct('patientID').populate('patientID');
  const upcomingPatients = patients.filter((patient: any) => patient.appointments[0].status === 'Upcoming');
  //check if there is no upcoming appointment throw an error
  if (upcomingPatients.length === 0) {
    return {
      status: StatusCodes.NOT_FOUND,
      message: 'No upcoming appointments',
      result: null
    };
  }
  return {
    status: StatusCodes.OK,
    message: 'Patients filtered successfully',
    result: upcomingPatients
  };
};

const getPatients = async (doctorID: string) => {
  //get patients that have appointments with this doctor
  const patients = await AppointmentModel.find({ doctorID: doctorID }).distinct('patientID').populate('patientID');
  return {
    status: StatusCodes.OK,
    message: 'User updated successfully',
    result: patients
  };
};
const filterAppointment = async (
  doctorID?: string,
  patientID?: string,
  status?: string,
  startDate?: Date,
  endDate?: Date
) => {
  try {
    let filter = {};
    if (doctorID) filter = { ...filter, doctorID: new mongoose.Types.ObjectId(doctorID) };
    if (patientID) filter = { ...filter, patientID: new mongoose.Types.ObjectId(patientID) };
    if (status) filter = { ...filter, status: status };
    if (startDate && endDate) {
      filter = {
        ...filter,
        startTime: { $gte: startDate, $lte: endDate },
        endTime: { $gte: startDate, $lte: endDate }
      };
    } else if (startDate) {
      filter = { ...filter, startTime: { $lte: startDate }, endTime: { $gte: startDate } };
    } else {
      filter = { ...filter, startTime: { $lte: { endDate } }, endTime: { $gte: endDate } };
    }
    const result = await AppointmentModel.find(filter);
    return {
      result: result,
      status: StatusCodes.OK,
      message: 'Successfully retrieved appointments'
    };
  } catch (e) {
    throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, `Error happened while retrieving appointments${e}`);
  }
};
