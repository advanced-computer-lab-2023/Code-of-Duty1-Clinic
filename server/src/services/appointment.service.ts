import { Appointment, Patient, Doctor } from '../models';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { HttpError } from '../utils';
import { el } from '@faker-js/faker';

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

// Function to get upcoming appointments for a user (patient or doctor) req 45
const getUpcomingAppointments = async (userId: string, role: string) => {
  try {
    // Check if the user is a doctor
    console.log(new Date());
    if (role === 'doctor' || role === 'Doctor') {
      const isDoctor = await Doctor.exists({ _id: userId });

      if (isDoctor) {
        // If it's a doctor, retrieve the doctor's appointments
        return {
          status: StatusCodes.OK,
          message: 'Appointments retrieved successfully',
          result: await Appointment.find({ doctorID: userId, startDate: { $gte: new Date() } }),
        };
      }
      else {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          'No doctor with this id'
        );
      }
    } else if (role === 'patient' || role === 'Patient') {
      // If role not a doctor, so its a patient and check for its existance 
      const isPatient = await Patient.exists({ _id: userId });
      if (isPatient) {
        // If it's a patient, retrieve the patient's appointments
        return {
          status: StatusCodes.OK,
          message: 'Appointments retrieved successfully',
          result: await Appointment.find({ patientID: userId, startDate: { $gte: new Date() } }),
        };


      } else {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          'No patient with this id'
        );
      }
    }
    else {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Role is neither a doctor nor a patient'
      );
    }

  } catch (error) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'User is neither a doctor nor a patient'
    );
  }
};



// Function to get past appointments for a user (patient or doctor) contiue req 45
const getPastAppointments = async (userId: string, role: string) => {
  try {
    // Check if the user is a doctor
    if (role === 'doctor' || role === 'Doctor') {
      const DoctorExist = await Doctor.exists({ _id: userId });

      if (DoctorExist) {
        // If it's a doctor, retrieve the doctor's past appointments
        return {
          status: StatusCodes.OK,
          message: 'Past appointments retrieved successfully',
          result: await Appointment.find({ doctorID: userId, endDate: { $lt: new Date() } }),
        };
      }
      else {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          'No doctor with this id'
        );
      }
    }
    else if (role === 'patient' || role === 'Patient') {
      // If role not a doctor, so its a patient and check for its existance 
      const PatientExist = await Patient.exists({ _id: userId });

      if (PatientExist) {
        // If it's a patient, retrieve the patient's past appointments
        return {
          status: StatusCodes.OK,
          message: 'Past appointments retrieved successfully',
          result: await Appointment.find({ patientID: userId, endDate: { $lt: new Date() } }),
        };
      } else {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          'No patient with this id'
        );
      }
    }
    else {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Role is neither a doctor nor a patient'
      );
    }

  }

  catch (error) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'User is neither a doctor nor a patient'
    );
  }
};

// Function to filter appointments by date or status (upcoming, completed, cancelled, rescheduled) req 46
const filterAppointments = async (query: any) => {
  try {
    let appointments: any = [];
    const startDate = query.startDate ? new Date(query.startDate) : new Date('1000-01-01T00:00:00.000Z');
    const endDate = query.endDate ? new Date(query.endDate) : new Date('9999-01-01T00:00:00.000Z');
    const status = query.status ? query.status : { $in: ['Upcoming', 'Completed', 'Cancelled', 'Rescheduled'] };
    // Check if the user is a doctor
    console.log(query.status);
    console.log(status);
    console.log(query.startDate);
    console.log(startDate);
    console.log(query.endDate);
    console.log(endDate);
    if (query.role === 'doctor' || query.role === 'Doctor') {
      // If it's a doctor, retrieve the doctor's appointments
      appointments = await Appointment.find({ doctorID: query.doctorID, startDate: { $gte: startDate }, endDate: { $lte: endDate }, status: status });


    } else {
      // If not a doctor, check if it's a patient
      if (query.role === 'patient' || query.role === 'Patient') {
        // If it's a patient, retrieve the patient's appointments
        appointments = await Appointment.find({ patientID: query.patientID, startDate: { $gte: startDate }, endDate: { $lte: endDate }, status: status });

      } else {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          'User is neither a doctor nor a patient'
        );
      }
    }
    return {
      status: StatusCodes.OK,
      message: 'Appointments retrieved successfully',
      result: appointments,
    };
  } catch (error) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'User is neither a doctor nor a patient'
    );
  }
};

export { getAppointments, getUpcomingAppointments, getPastAppointments, filterAppointments };
