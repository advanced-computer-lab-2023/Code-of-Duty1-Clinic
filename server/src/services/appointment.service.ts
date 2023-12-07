import { Appointment, Doctor, Patient, User } from '../models';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';

const getAppointments = async (query: any) => {
  if (query.startDate) query.startDate = { $gte: query.startDate };
  if (query.endDate) query.endDate = { $lte: query.endDate };
  if (!query.status) query.status = { $ne: 'Pending' };

  const now = new Date(Date.now());
  await Appointment.updateMany({ endDate: { $lt: now }, status: 'Upcoming' }, { status: 'Completed' }); // Not scalable but will do

  let appointments = await Appointment.find(query).populate('doctorID', 'name');

  // I should be able to view my family's appointments
  if (query.patientID) {
    const { patientID, ...restQuery } = query;
    const user = await Patient.findById(patientID).select('family');

    let family = user?.family || [];
    const familyIDs = family.reduce((acc: any, member: any) => {
      if (member.userID) acc.push(member.userID);
      return acc;
    }, []);

    const familyAppointments = await Appointment.find({ patientID: { $in: familyIDs }, ...restQuery }).populate(
      'doctorID',
      'name'
    );

    appointments = appointments.concat(familyAppointments);
  }

  // Transform the result to the desired format
  const formattedAppointments = appointments.map((appointment) => ({
    doctorName: (appointment.doctorID as any).name,
    ...appointment.toJSON()
  }));

  return {
    status: StatusCodes.OK,
    message: 'Appointments retrieved successfully',
    result: formattedAppointments
  };
};

const createAppointment = async (doctorID: String, body: any) => {
  const doctor = await Doctor.findById(doctorID);
  if (!doctor) throw new HttpError(StatusCodes.NOT_FOUND, 'Doctor not found');

  if (body.startDate < new Date(Date.now()))
    throw new HttpError(StatusCodes.BAD_REQUEST, 'You cannot schedule an appointment in the past');

  body.doctorID = doctorID;
  const newAppointment = await Appointment.create(body);

  doctor.wallet! += newAppointment.sessionPrice;
  await doctor.save();

  return {
    status: StatusCodes.CREATED,
    message: 'Appointment created successfully',
    result: newAppointment
  };
};

// Double check the date local time issue
const cancelAppointment = async (userID: string, appointmentID: string) => {
  const appointment = await Appointment.findById(appointmentID);
  if (!appointment) throw new HttpError(StatusCodes.NOT_FOUND, 'Appointment not found');

  const status = appointment.status;
  if (status === 'Cancelled' || status === 'Completed' || new Date(appointment.startDate) < new Date())
    throw new HttpError(StatusCodes.BAD_REQUEST, 'You cannot cancel this appointment due to its status');

  const patient = await Patient.findById(appointment.patientID);
  if (!patient) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  // I should also be able to cancel my family appointments
  let patientFamily = patient.family || [];
  const isFamily = patientFamily.some((member: any) => member.userID == userID);

  if (!isFamily && appointment.patientID.toString() != userID && appointment.doctorID.toString() != userID)
    throw new HttpError(StatusCodes.FORBIDDEN, 'You are not authorized to do this');

  // Because follow ups are free, we don't need to refund the patient
  if (status !== 'Pending') {
    // if the appointment was cancelled by the doctor or by patient less than 24 hours before now, the patient will be refunded
    if (
      appointment.doctorID.toString() == userID ||
      new Date(appointment.startDate) >= new Date(Date.now() + 24 * 60 * 60 * 1000)
    ) {
      patient.wallet! += appointment.sessionPrice;
      patient.save();

      Doctor.findByIdAndUpdate(appointment.doctorID, { $inc: { wallet: -appointment.sessionPrice } }); // Maybe he will be indebted
    }

    // Should send a notification and email to the doctor and patient
  }

  appointment.status = 'Cancelled';
  appointment.save();

  return {
    status: StatusCodes.OK,
    message: 'Appointment cancelled successfully'
  };
};

export { getAppointments, createAppointment, cancelAppointment };
