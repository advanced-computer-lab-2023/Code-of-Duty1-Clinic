import { Appointment, Doctor, Patient } from '../models';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { HttpError } from '../utils';

const getAppointments = async (query: any) => {
  // Update the query based on startDate and endDate if provided
  if (query.startDate) query.startDate = { $gte: query.startDate };
  if (query.endDate) query.endDate = { $lte: query.endDate };

  // Fetch appointments with populated doctor and patient names
  const appointments = await Appointment.find(query)
    .populate('doctorID', 'name') // Assuming 'name' is the field in the Doctor model
    .populate('patientID', 'name'); // Assuming 'name' is the field in the Patient model

  // Transform the result to the desired format
  const formattedAppointments = appointments.map((appointment) => ({
    patientName: (appointment.patientID as any).name,
    doctorName: (appointment.doctorID as any).name,
    _id: appointment._id,
    status: appointment.status,
    sessionPrice: appointment.sessionPrice,
    startDate: appointment.startDate,
    endDate: appointment.endDate,
    isFollowUp: appointment.isFollowUp,
    __v: appointment.__v
  }));
  return {
    status: StatusCodes.OK,
    message: 'Appointments retrieved successfully',
    result: formattedAppointments || [] // Return an empty array if appointments is falsy
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

// Function to get upcoming or past appointments for a user (patient or doctor) req 45
const getUpcoming_Past_Appointments = async (userId: string, role: string, status: string) => {
  let query: any = {};
  let model: any;

  if ((role === 'doctor' || role === 'Doctor') && (await Doctor.exists({ _id: userId }))) {
    query = {
      doctorID: userId,
      startDate: status === 'Upcoming' ? { $gte: new Date() } : { $lt: new Date() }
    };
    model = Doctor;
  } else if ((role === 'patient' || role === 'Patient') && (await Patient.exists({ _id: userId }))) {
    query = {
      patientID: userId,
      startDate: status === 'Upcoming' ? { $gte: new Date() } : { $lt: new Date() }
    };
    model = Patient;
  } else {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Role is neither a doctor nor a patient or wrong user id');
  }

  const appointments = await Appointment.find(query).populate('patientID', 'name').populate('doctorID', 'name');

  if (model) {
    const formattedAppointments = appointments.map((appointment) => ({
      patientName: (appointment.patientID as any)?.name,
      doctorName: (appointment.doctorID as any)?.name,
      _id: appointment._id,
      status: appointment.status,
      sessionPrice: appointment.sessionPrice,
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      isFollowUp: appointment.isFollowUp,
      __v: appointment.__v
    }));

    return {
      status: StatusCodes.OK,
      message: 'Appointments retrieved successfully',
      result: formattedAppointments
    };
  }
};

// Function to filter appointments by date or status (upcoming, completed, cancelled, rescheduled) req 46
const filterAppointments = async (query: any) => {
  const startDate = query.startDate ? new Date(query.startDate) : new Date('1000-01-01T00:00:00.000Z');
  const endDate = query.endDate ? new Date(query.endDate) : new Date('9999-01-01T00:00:00.000Z');
  const status = query.status ? query.status : { $in: ['Upcoming', 'Completed', 'Cancelled', 'Rescheduled'] };

  let model: any;
  let roleQuery: any;

  if ((query.role === 'doctor' || query.role === 'Doctor') && (await Doctor.exists({ _id: query.doctorID }))) {
    model = Doctor;
    roleQuery = { doctorID: query.doctorID };
  } else if (
    (query.role === 'patient' || query.role === 'Patient') &&
    (await Patient.exists({ _id: query.patientID }))
  ) {
    model = Patient;
    roleQuery = { patientID: query.patientID };
  } else {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'User is neither a doctor nor a patient');
  }

  const appointments = await Appointment.find({
    ...roleQuery,
    startDate: { $gte: startDate },
    endDate: { $lte: endDate },
    status: status
  })
    .populate('patientID', 'name') // Assuming 'name' is the field in the Patient model
    .populate('doctorID', 'name'); // Assuming 'name' is the field in the Doctor model

  if (model) {
    const formattedAppointments = appointments.map((appointment) => ({
      patientName: (appointment.patientID as any)?.name,
      doctorName: (appointment.doctorID as any)?.name,
      _id: appointment._id,
      status: appointment.status,
      sessionPrice: appointment.sessionPrice,
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      isFollowUp: appointment.isFollowUp,
      __v: appointment.__v
    }));

    return {
      status: StatusCodes.OK,
      message: 'Appointments retrieved successfully',
      result: formattedAppointments
    };
  }
};

export { getAppointments, createAppointment, getUpcoming_Past_Appointments, filterAppointments };
