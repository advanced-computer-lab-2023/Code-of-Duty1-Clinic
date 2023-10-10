import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/user.model';
import AppointmentModel from '../models/appointment.model';


const getPatients = async (doctorID: string) => {
    //get patients that have appointments with this doctor
    const patients = await AppointmentModel.find({ doctorID: doctorID }).distinct('patientID').populate('patientID');
    return {
        status: StatusCodes.OK,
        message: 'User updated successfully',
        result: patients
    };
};

const getPatientsByName = async (doctorID: string, name: string) => {
    //get patients that have appointments with this doctor
    const patients = await AppointmentModel.find({ doctorID: doctorID }).distinct('patientID').populate('patientID');
    const patientsByName = patients.filter((patient: any) => patient.name.includes(name));
    //check if there is no patient with this name throw an error
    if (patientsByName.length === 0) {
        return {
            status: StatusCodes.NOT_FOUND,
            message: 'No patient with this name',
            result: null
        };
    }
    return {
        status: StatusCodes.OK,
        message: 'Patients retrieved successfully',
        result: patientsByName
    };
}

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
}

//select a patient from the list of patients
const selectPatient = async (doctorID: string, patientID: string) => {
    //get patients that have appointments with this doctor
    const patients = await AppointmentModel.find({ doctorID: doctorID }).distinct('patientID').populate('patientID');
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
}