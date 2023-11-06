import { Appointment, Doctor } from '../models';
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

const createAppointment = async (patientID: String, doctorID: String, body: any) => {
  const doctor = await Doctor.findById(doctorID);
  if (!doctor) throw new HttpError(StatusCodes.NOT_FOUND, 'Doctor not found');

  const weeklySlots = doctor.weeklySlots;
  if (!weeklySlots) throw new HttpError(StatusCodes.NOT_FOUND, 'No available appointments for this doctor');

  body.patientID = patientID;
  body.doctorID = doctorID;
  const newAppointment = await Appointment.create(body);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[newAppointment.startDate.getDay()];
  // console.log(dayOfWeek);
  const dailySlots = weeklySlots[dayOfWeek as keyof typeof weeklySlots];
  for (let i = 0; i < dailySlots.length; i++) {
    const slot = dailySlots[i];
    // console.log(slot.from.hours);
    // console.log(body.from.hours);
    // console.log(slot.from.minutes);
    // console.log(body.from.minutes);
    if (slot.from.hours === body.from.hours && slot.from.minutes === body.from.minutes) {
      slot.isReserved = true;
      await doctor.save();
      break;
    }
  }

  return {
    status: StatusCodes.CREATED,
    message: 'Appointment created successfully',
    result: newAppointment
  };
};

export { getAppointments, createAppointment };
