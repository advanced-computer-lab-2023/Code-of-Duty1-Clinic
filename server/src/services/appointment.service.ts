import { Appointment, Doctor , Patient} from '../models';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { HttpError } from '../utils';

const getAppointments = async (query: any) => {
  if (query.startDate) query.startDate = { $gte: query.startDate };
  if (query.endDate) query.endDate = { $lte: query.endDate };

  const appointments = await Appointment.find(query)
    .populate('doctorID', 'name') // Populate the doctorID field with the name property
    .populate('patientID', 'name'); // Populate the patientID field with the name property

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

  body.patientID = patientID;
  body.doctorID = doctorID;
  const newAppointment = await Appointment.create(body);

  return {
    status: StatusCodes.CREATED,
    message: 'Appointment created successfully',
    result: newAppointment
  };
};

// Function to get upcoming appointments for a user (patient or doctor) req 45
const getUpcomingAppointments = async (userId: string, role: string) => {
  if (role === 'doctor' || role === 'Doctor') {
    if (await Doctor.exists({ _id: userId })) {
      const appointments = await Appointment.find({ doctorID: userId, startDate: { $gte: new Date() } })
        .populate('doctorID', 'name') // Populate the doctorID field with the name property
        .populate('patientID', 'name'); // Populate the patientID field with the name property

      return {
        status: StatusCodes.OK,
        message: 'Appointments retrieved successfully',
        result: appointments,
      };
    }
  } else if (role === 'patient' || role === 'Patient') {
    if (await Patient.exists({ _id: userId })) {
      const appointments = await Appointment.find({ patientID: userId, startDate: { $gte: new Date() } })
        .populate('doctorID', 'name') // Populate the doctorID field with the name property
        .populate('patientID', 'name'); // Populate the patientID field with the name property

      return {
        status: StatusCodes.OK,
        message: 'Appointments retrieved successfully',
        result: appointments,
      };
    }
  } else {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'Role is neither a doctor nor a patient or wrong user id'
    );
  }
};


// Function to get past appointments for a user (patient or doctor) contiue req 45
const getPastAppointments = async (userId: string, role: string) => {
  if (role === 'doctor' || role === 'Doctor') {
    if (await Doctor.exists({ _id: userId })) {
      return {
        status: StatusCodes.OK,
        message: 'Past appointments retrieved successfully',
        result: await Appointment.find({ doctorID: userId, endDate: { $lt: new Date() } })
          .populate('doctorID', 'name') // Populate the doctorID field with the name property
          .populate('patientID', 'name'), // Populate the patientID field with the name property
      };
    }
  } else if (role === 'patient' || role === 'Patient') {
    if (await Patient.exists({ _id: userId })) {
      return {
        status: StatusCodes.OK,
        message: 'Past appointments retrieved successfully',
        result: await Appointment.find({ patientID: userId, endDate: { $lt: new Date() } })
          .populate('doctorID', 'name') // Populate the doctorID field with the name property
          .populate('patientID', 'name'), // Populate the patientID field with the name property
      };
    }
  } else {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'Role is neither a doctor nor a patient or wrong user id'
    );
  }
};


// Function to filter appointments by date or status (upcoming, completed, cancelled, rescheduled) req 46
const filterAppointments = async (query: any) => {
  const startDate = query.startDate ? new Date(query.startDate) : new Date('1000-01-01T00:00:00.000Z');
  const endDate = query.endDate ? new Date(query.endDate) : new Date('9999-01-01T00:00:00.000Z');
  const status = query.status ? query.status : { $in: ['Upcoming', 'Completed', 'Cancelled', 'Rescheduled'] };

  let result;

  if (query.role === 'doctor' || query.role === 'Doctor') {
    result = await Appointment.find({ doctorID: query.doctorID, startDate: { $gte: startDate }, endDate: { $lte: endDate }, status: status })
      .populate('doctorID', 'name') // Populate the doctorID field with the name property
      .populate('patientID', 'name'); // Populate the patientID field with the name property
  } else if (query.role === 'patient' || query.role === 'Patient') {
    result = await Appointment.find({ patientID: query.patientID, startDate: { $gte: startDate }, endDate: { $lte: endDate }, status: status })
      .populate('doctorID', 'name') // Populate the doctorID field with the name property
      .populate('patientID', 'name'); // Populate the patientID field with the name property
  } else {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'User is neither a doctor nor a patient'
    );
  }

  return {
    status: StatusCodes.OK,
    message: 'Appointments retrieved successfully',
    result: result,
  };
};


export { getAppointments, createAppointment , getUpcomingAppointments, getPastAppointments, filterAppointments };
