import { Appointment, Doctor, IAppointment, ICommonUser, Patient, User } from '../models';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';
import { NotificationManager } from '../utils/notification';
import { sendEmail } from '../utils';
const getAppointments = async (query: any) => {
  if (query.startDate) query.startDate = { $gte: query.startDate };
  if (query.endDate) query.endDate = { $lte: query.endDate };

  const now = new Date(Date.now() + 2 * 60 * 60 * 1000);
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

const createAppointment = async (doctorID: string, body: any) => {
  console.log(doctorID, body,"147852369--------------");
  const doctor = await Doctor.findById(doctorID);
  if (!doctor) throw new HttpError(StatusCodes.NOT_FOUND, 'Doctor not found');
  const patientEmail = body.patientEmail;
  const doctorEmail = doctor.email;
  console.log(doctorEmail , patientEmail,"---------------------------")
  delete body.patientEmail;
  // A local time zone issue
  if (new Date(body.startDate) < new Date(Date.now() + 2 * 60 * 60 * 1000))
    throw new HttpError(StatusCodes.BAD_REQUEST, 'You cannot schedule an appointment in the past');

  body.doctorID = doctorID;
  const newAppointment = await Appointment.create(body);

  doctor.wallet! += newAppointment.sessionPrice;
  await doctor.save();
  
  const options :Intl.DateTimeFormatOptions= {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'short',
};

const formatter = new Intl.DateTimeFormat('en-US', options);

const startDate = formatter.format(new Date(body.startDate));
const endDate = formatter.format(new Date(body.endDate));

await NotificationManager.notify(
  doctorID,
  "Appointment",
  `Time is from ${startDate} to ${endDate}`,
  `New appointment with Patient ${body.patientName}`
  );
  await NotificationManager.notify(
  body.patientID,
  "Appointment",
  `Time is from ${startDate} to ${endDate}`,
  `New appointment with Doctor ${doctor.name}`
  );
  sendEmail(doctorEmail,"New Clinic Appointment", `Dear Doctor ${doctor.name},\n This mail is sent to inform you of a new appointment with Patient ${body.patientName}.\nThe time is from ${startDate} to ${endDate}.\nBest Regards\nEl7ani Clinic Team`);
  sendEmail(patientEmail,"New Clinic Appointment",`Dear Patient ${body.patientName},\n This mail is sent to inform you of a new appointment with Doctor ${doctor.name}.\nThe time is from ${startDate} to ${endDate}.\nBest Regards\nEl7ani Clinic Team`);
  
  return {
    status: StatusCodes.CREATED,
    message: 'Appointment created successfully',
    result: newAppointment
  };
};

const rescheduleAppointment = async (userID: string, appointmentID: any, newBody: any) => {
  const appointment = await validateAppointment(userID, appointmentID);
  if (appointment.status !== 'Upcoming' || appointment.startDate < new Date(Date.now() + 2 * 60 * 60 * 1000))
    throw new HttpError(StatusCodes.BAD_REQUEST, 'You cannot reschedule a non-upcoming appointment');

  const newAppointment = { ...appointment.toJSON(), ...newBody }; // newBody will override some of the old values
  appointment.set(newAppointment);
  appointment.save();
  
  sendNotification("Rescheduled", appointment, newAppointment);

  return {
    status: StatusCodes.OK,
    message: 'Appointment rescheduled successfully'
  };
};

const cancelAppointment = async (userID: string, appointmentID: string) => {
  const appointment = await validateAppointment(userID, appointmentID);
  if (appointment.status === 'Completed' || appointment.startDate < new Date(Date.now() + 2 * 60 * 60 * 1000))
    throw new HttpError(StatusCodes.BAD_REQUEST, 'You cannot cancel a completed appointment');

  const patient = await Patient.findById(appointment.patientID);
  if (!patient) throw new HttpError(StatusCodes.NOT_FOUND, 'Patient not found');

  // Because follow ups are free, we don't need to refund the patient
  if (appointment.status !== 'Pending') {
    // if the appointment was cancelled by the doctor or by patient less than 24 hours before now, the patient will be refunded
    if (
      appointment.doctorID.toString() == userID ||
      new Date(appointment.startDate) >= new Date(Date.now() + 26 * 60 * 60 * 1000)
    ) {
      patient.wallet! += appointment.sessionPrice;
      patient.save();

      Doctor.findByIdAndUpdate(appointment.doctorID, { $inc: { wallet: -appointment.sessionPrice } }); // Maybe he will be indebted
    }
    sendNotification("Canceled",appointment);
    // here it should send a notification and email to the doctor and patient
  }

  appointment.status = 'Cancelled';
  appointment.save();

  return {
    status: StatusCodes.OK,
    message: 'Appointment cancelled successfully'
  };
};

// if user is doctor, status will be upcoming, if user is patient, status will be pending
const scheduleFollowUp = async (userID: string, prevAppointmentID: string, appointmentDetails: any) => {
  const appointment = await validateAppointment(userID, prevAppointmentID);

  if (appointment.status !== 'Completed')
    throw new HttpError(StatusCodes.BAD_REQUEST, 'You cannot schedule a follow up');

  const { _id, ...prevAppointment } = appointment.toJSON();
  const newAppointment = {
    ...prevAppointment,
    ...appointmentDetails,
    isFollowUp: true,
    previousAppointment: prevAppointmentID,
    status: userID === appointment.doctorID.toString() ? 'Upcoming' : 'Pending'
  };

  const newAppointmentDoc = await Appointment.create(newAppointment);
   

  return {
    status: StatusCodes.CREATED,
    message: 'Follow up appointment scheduled successfully',
    result: newAppointmentDoc
  };
};

const approveDisapproveAppointment = async (userID: string, appointmentID: string, isApproved: boolean) => {
  const appointment = await Appointment.findById(appointmentID);
  if (!appointment) throw new HttpError(StatusCodes.NOT_FOUND, 'Appointment not found');

  if (appointment.status !== 'Pending')
    throw new HttpError(StatusCodes.BAD_REQUEST, 'You cannot approve/disapprove this appointment');

  if (appointment.doctorID.toString() !== userID)
    throw new HttpError(StatusCodes.FORBIDDEN, 'You are not authorized to do this');

  appointment.status = isApproved ? 'Upcoming' : 'Cancelled';
  appointment.save();

  return {
    status: StatusCodes.OK,
    message: 'Appointment approved/disapproved successfully'
  };
};

// helper function
async function validateAppointment(userID: string, appointmentID: string) {
  const appointment = await Appointment.findById(appointmentID);
  if (!appointment) throw new HttpError(StatusCodes.NOT_FOUND, 'Appointment not found');

  const status = appointment.status;
  if (status === 'Cancelled')
    throw new HttpError(StatusCodes.BAD_REQUEST, 'You cannot change this appointment because it was cancelled');

  if (appointment.patientID.toString() != userID) {
    const patient: any = await User.findById(userID);
    if (!patient) throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');

    // I should also be able to cancel my family appointments
    let userFamily = patient.family || [];
    const isFamily = userFamily.some((member: any) => member.userID == appointment.patientID.toString());

    if (!isFamily && appointment.doctorID.toString() != userID)
      throw new HttpError(StatusCodes.FORBIDDEN, 'You are not authorized to do this');
  }

  return appointment;
}
const sendNotification = async (type: string, appointment: IAppointment, newAppointment?: IAppointment) => {
  console.log("Sending notification on appointment update .....");
  const users = await User.find({
    _id: { $in: [appointment.patientID, appointment.doctorID] }
  });
  let title = `Your Appointment is ${type}`;
  let time = (app: IAppointment) => `from ${app.startDate.toUTCString()} to ${app.endDate.toUTCString()}`;
  let message = `Your appointment ${time(appointment)} is canceled`;
  if (type == 'Rescheduled') {
    message = `Your appointment ${time(appointment)} is rescheduled and your new appointment is ${time(newAppointment!)}`;
  }
  const getTitle = (user: ICommonUser) => {
    return user.role == "patient" ? "user" : "doctor"
  }
  for (const user of users) {
    try {
      NotificationManager.notify(user._id.toString(), type, message, title, new Date());
      let mailBody = `Hello ${getTitle(user)} ${user.name},\nWe hope this mail finds you will. we are sending this mail to let you know that ${message.toLowerCase()}\n\nBest Regards \nEl7ani Clinic Team `
      sendEmail(user.email, title, mailBody);

    } catch (e) {
      console.log("Error while notifying for appointment update")
      continue;
    }
  }
  console.log("Done Sending notification on appointment update");
}

export {
  getAppointments,
  createAppointment,
  rescheduleAppointment,
  cancelAppointment,
  scheduleFollowUp,
  approveDisapproveAppointment
};
