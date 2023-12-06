import { Appointment, Doctor, Patient, User } from '../models';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';

const getAppointments = async (query: any) => {
  if (query.startDate) query.startDate = { $gte: query.startDate };
  if (query.endDate) query.endDate = { $lte: query.endDate };

  let appointments = await Appointment.find(query).populate('doctorID', 'name');

  // I should be able to view my family appointments
  if (query.patientID) {
    const user = await Patient.findById(query.patientID).select('family');
    let family = user?.family || [];

    const familyIDs = family.reduce((acc: any, member) => {
      if ((member as any).userID) acc.push((member as any).userID);

      return acc;
    }, []);

    const familyAppointments = await Appointment.find({ patientID: { $in: familyIDs } }).populate('doctorID', 'name');

    appointments = [...appointments, ...familyAppointments];
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

  body.doctorID = doctorID;
  const newAppointment = await Appointment.create(body);

  return {
    status: StatusCodes.CREATED,
    message: 'Appointment created successfully',
    result: newAppointment
  };
};

const cancelAppointment = async (userID: string, appointmentID: string) => {
  const appointment = await Appointment.findById(appointmentID);
  if (!appointment) throw new HttpError(StatusCodes.NOT_FOUND, 'Appointment not found');

  const user = await Patient.findById(appointment.patientID);
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

  // I should be also able to cancel my family appointments
  let patientFamily = user.family || [];
  const familyIDs = patientFamily.reduce((acc: any, member: any) => {
    if (member.userID) acc.push(member.userID);

    return acc;
  }, []);

  if (
    appointment.patientID.toString() != userID &&
    appointment.doctorID.toString() != userID &&
    !familyIDs.includes(userID)
  )
    throw new HttpError(StatusCodes.FORBIDDEN, 'You are not authorized to do this');

  appointment.status = 'Cancelled';
  await appointment.save();

  //  if the appointment was less than 24 hours before now, the patient will be refunded
  if (appointment.startDate < new Date(Date.now() + 24 * 60 * 60 * 1000)) {
    user.wallet! += appointment.sessionPrice;
    await user.save();
  }

  return {
    status: StatusCodes.OK,
    message: 'Appointment cancelled successfully',
    result: appointment
  };
};

export { getAppointments, createAppointment, cancelAppointment };
