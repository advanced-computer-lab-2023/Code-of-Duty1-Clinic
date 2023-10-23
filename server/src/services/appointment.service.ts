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

export { getAppointments };
