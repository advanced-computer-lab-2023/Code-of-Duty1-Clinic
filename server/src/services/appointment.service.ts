import { Appointment } from '../models';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { HttpError } from '../utils';

const getAppointments = async (query: any) => {
  if (query.startDate) query.startDate = { $gte: query.startDate };
  if (query.endDate) query.endDate = { $lte: query.endDate };

  const appointments = await Appointment.find(query);

  if (!appointments) throw new HttpError(StatusCodes.NOT_FOUND, 'No upcoming appointments');

  return {
    status: StatusCodes.OK,
    message: 'Appointments retrieved successfully',
    result: appointments
  };
};

//I'll edit them later
/*
const createAppointment = async (patientID: String, doctorID: String, body: any) => {
  body.patientID = patientID;
  body.doctorID = doctorID;
  const newAppointment = await Appointment.create(body);

  return {
    status: StatusCodes.CREATED,
    message: 'Appointment created successfully',
    result: newAppointment
  };
};

const getDoctorAppointments = async (patientID: String, doctorID: String) => {
  const appointments = await Appointment.find({ doctorID });

  if (!appointments) throw new HttpError(StatusCodes.NOT_FOUND, 'No available appointments for this doctor');

  return {
    status: StatusCodes.OK,
    message: 'Appointments retrieved successfully',
    result: appointments
  };
};
export { getAppointments, createAppointment, getDoctorAppointments };
*/

export { getAppointments };
