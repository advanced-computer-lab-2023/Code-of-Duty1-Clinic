import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/user.model';
import AppointmentModel from '../models/appointment.model';

const getPatients = async (doctorID: string) => {
  //get patients that have appointments with this doctor
  const patients = await AppointmentModel.find({ doctorID }).select('patientID').populate('patientID');
  if (!patients) {
    return {
      status: StatusCodes.NOT_FOUND,
      message: 'No patient',
      result: null
    };
  }
  return {
    status: StatusCodes.OK,
    message: 'Patients retrieved successfully',
    result: patients
  };
};

//select a patient from the list of patients
const selectPatient = async (doctorID: string, patientID: string) => {
  //get patients that have appointments with this doctor
  const patients = await AppointmentModel.find({ doctorID }).select('patientID').populate('patientID');
  const patient = patients.find((patient: any) => patient._id.toString() === patientID);
  //check if there is no patient with this id throw an error
  if (!patient) {
    return {
      status: StatusCodes.NOT_FOUND,
      message: 'No patient with this id',
      result: null
    };
  }
  return {
    status: StatusCodes.OK,
    message: 'Patient selected successfully',
    result: patient
  };
};

//export all functions as a module
export { getPatients, selectPatient };
