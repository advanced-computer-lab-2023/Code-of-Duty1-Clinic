import AppointmentModel from '../models/appointment.model';
import { StatusCodes } from 'http-status-codes';
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
