import { Appointment, Doctor , Patient} from '../models';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { HttpError } from '../utils';

const getAppointments = async (query: any) => {
  if (query.startDate) query.startDate = { $gte: query.startDate };
  if (query.endDate) query.endDate = { $lte: query.endDate };

  const appointments = await Appointment.find(query);

  if (!appointments || appointments.length === 0) {
    return {
      status: StatusCodes.OK,
      message: 'Appointments retrieved successfully',
      result: [],
    };
  }

  const doctorIds = appointments.map(appointment => appointment.doctorID);
  const patientIds = appointments.map(appointment => appointment.patientID);

  // Fetch doctors and patients based on the extracted ids
  const doctors = await Doctor.find({ _id: { $in: doctorIds } });
  const patients = await Patient.find({ _id: { $in: patientIds } });

  const doctorMap = new Map(doctors.map(doctor => [doctor._id.toString(), doctor]));
  const patientMap = new Map(patients.map(patient => [patient._id.toString(), patient]));

  const formattedAppointments = appointments.map(appointment => {
    const doctor = doctorMap.get(appointment.doctorID.toString());
    const patient = patientMap.get(appointment.patientID.toString());

    // Accessing the properties directly without _doc
    return {
      patientName: patient ? patient.get('name') : 'Unknown Patient',
      doctorName: doctor ? doctor.get('name') : 'Unknown Doctor',
      ...appointment.toObject(),
    };
  });

  return {
    status: StatusCodes.OK,
    message: 'Appointments retrieved successfully',
    result: formattedAppointments,
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
  let appointments;

  if (role.toLowerCase() === 'doctor') {
    if (await Doctor.exists({ _id: userId })) {
      appointments = await Appointment.find({ doctorID: userId, startDate: { $gte: new Date() } });
    }
  } else if (role.toLowerCase() === 'patient') {
    if (await Patient.exists({ _id: userId })) {
      appointments = await Appointment.find({ patientID: userId, startDate: { $gte: new Date() } });
    }
  } else {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'Role is neither a doctor nor a patient or wrong user id'
    );
  }

  if (!appointments || appointments.length === 0) {
    return {
      status: StatusCodes.OK,
      message: 'Appointments retrieved successfully',
      result: [],
    };
  }

  // Fetch doctors and patients based on the extracted ids
  const doctorIds = appointments.map(appointment => appointment.doctorID);
  const patientIds = appointments.map(appointment => appointment.patientID);

  const doctors = await Doctor.find({ _id: { $in: doctorIds } });
  const patients = await Patient.find({ _id: { $in: patientIds } });

  const doctorMap = new Map(doctors.map(doctor => [doctor._id.toString(), doctor]));
  const patientMap = new Map(patients.map(patient => [patient._id.toString(), patient]));

  const formattedAppointments = appointments.map(appointment => {
    const doctor = doctorMap.get(appointment.doctorID.toString());
    const patient = patientMap.get(appointment.patientID.toString());

    // Accessing the properties directly without _doc
    return {
      patientName: patient ? patient.get('name') : 'Unknown Patient',
      doctorName: doctor ? doctor.get('name') : 'Unknown Doctor',
      ...appointment.toObject(),
    };
  });

  return {
    status: StatusCodes.OK,
    message: 'Appointments retrieved successfully',
    result: formattedAppointments,
  };
};



// Function to get past appointments for a user (patient or doctor) contiue req 45
const getPastAppointments = async (userId: string, role: string) => {
  let appointments;

  if (role.toLowerCase() === 'doctor') {
    if (await Doctor.exists({ _id: userId })) {
      appointments = await Appointment.find({ doctorID: userId, endDate: { $lt: new Date() } });
    }
  } else if (role.toLowerCase() === 'patient') {
    if (await Patient.exists({ _id: userId })) {
      appointments = await Appointment.find({ patientID: userId, endDate: { $lt: new Date() } });
    }
  } else {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'Role is neither a doctor nor a patient or wrong user id'
    );
  }

  if (!appointments || appointments.length === 0) {
    return {
      status: StatusCodes.OK,
      message: 'Appointments retrieved successfully',
      result: [],
    };
  }

  // Fetch doctors and patients based on the extracted ids
  const doctorIds = appointments.map(appointment => appointment.doctorID);
  const patientIds = appointments.map(appointment => appointment.patientID);

  const doctors = await Doctor.find({ _id: { $in: doctorIds } });
  const patients = await Patient.find({ _id: { $in: patientIds } });

  const doctorMap = new Map(doctors.map(doctor => [doctor._id.toString(), doctor]));
  const patientMap = new Map(patients.map(patient => [patient._id.toString(), patient]));

  const formattedAppointments = appointments.map(appointment => {
    const doctor = doctorMap.get(appointment.doctorID.toString());
    const patient = patientMap.get(appointment.patientID.toString());

    // Accessing the properties directly without _doc
    return {
      patientName: patient ? patient.get('name') : 'Unknown Patient',
      doctorName: doctor ? doctor.get('name') : 'Unknown Doctor',
      ...appointment.toObject(),
    };
  });

  return {
    status: StatusCodes.OK,
    message: 'Past appointments retrieved successfully',
    result: formattedAppointments,
  };
};



// Function to filter appointments by date or status (upcoming, completed, cancelled, rescheduled) req 46
const filterAppointments = async (query: any) => {
  const startDate = query.startDate ? new Date(query.startDate) : new Date('1000-01-01T00:00:00.000Z');
  const endDate = query.endDate ? new Date(query.endDate) : new Date('9999-01-01T00:00:00.000Z');
  const status = query.status ? query.status : { $in: ['Upcoming', 'Completed', 'Cancelled', 'Rescheduled'] };

  let appointments;

  if (query.role.toLowerCase() === 'doctor') {
    appointments = await Appointment.find({
      doctorID: query.doctorID,
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
      status: status,
    });
  } else if (query.role.toLowerCase() === 'patient') {
    appointments = await Appointment.find({
      patientID: query.patientID,
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
      status: status,
    });
  } else {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'User is neither a doctor nor a patient');
  }

  if (!appointments || appointments.length === 0) {
    return {
      status: StatusCodes.OK,
      message: 'Appointments retrieved successfully',
      result: [],
    };
  }

  // Fetch doctors and patients based on the extracted ids
  const doctorIds = appointments.map(appointment => appointment.doctorID);
  const patientIds = appointments.map(appointment => appointment.patientID);

  const doctors = await Doctor.find({ _id: { $in: doctorIds } });
  const patients = await Patient.find({ _id: { $in: patientIds } });

  const doctorMap = new Map(doctors.map(doctor => [doctor._id.toString(), doctor]));
  const patientMap = new Map(patients.map(patient => [patient._id.toString(), patient]));

  const formattedAppointments = appointments.map(appointment => {
    const doctor = doctorMap.get(appointment.doctorID.toString());
    const patient = patientMap.get(appointment.patientID.toString());

    // Accessing the properties directly without _doc
    return {
      patientName: patient ? patient.get('name') : 'Unknown Patient',
      doctorName: doctor ? doctor.get('name') : 'Unknown Doctor',
      ...appointment.toObject(),
    };
  });

  return {
    status: StatusCodes.OK,
    message: 'Appointments retrieved successfully',
    result: formattedAppointments,
  };
};


export { getAppointments, createAppointment , getUpcomingAppointments, getPastAppointments, filterAppointments };
