import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/user.model';
import AppointmentModel from '../models/appointment.model';
import PrescriptionModel from '../models/prescription.model';

const selectDoctor = async (doctorID: string) => {
  // Use Mongoose to find the doctor by ID
  const doctor = await UserModel.findById(doctorID);

  // Check if the doctor was found
  if (!doctor) {
    return {
      status: StatusCodes.NOT_FOUND,
      message: 'No doctor with this ID',
      result: null
    };
  }

  return {
    status: StatusCodes.OK,
    message: 'Doctor selected successfully',
    result: doctor
  };
}
const getAllPrescription = async (patientID: string) => {
  const presecription = await PrescriptionModel.find({ patientID: patientID });
  return {
    status: StatusCodes.OK,
    message: 'here all presecription',
    result: presecription
  };
}

const filterPrescriptions = async (
  patientID: string,
  filterType: 'date' | 'doctor' | 'filled' | 'unfilled',
  filterValue: Date | string | boolean
) => {
  // Get all prescriptions first using getAllPrescription
  const allPrescriptions = await getAllPrescription(patientID);

  // Filter the prescriptions based on the selected filter type
  const filteredPrescriptions = allPrescriptions.result.filter(prescription => {
    if (filterType === 'date' && prescription.dateIssued === filterValue) {
      return true;
    }
    if (filterType === 'doctor' && prescription.doctorID.toString() === filterValue) {
      return true;
    }
    if (filterType === 'filled' && prescription.isFilled === filterValue) {
      return true;
    }
    if (filterType === 'unfilled' && prescription.isFilled !== filterValue) {
      return true;
    }
    return false;
  });

  // Check if no prescriptions match the filter criteria
  if (filteredPrescriptions.length === 0) {
    return {
      status: StatusCodes.OK,
      message: `No prescriptions found for the selected ${filterType}`,
      result: [],
    };
  }

  return {
    status: StatusCodes.OK,
    message: `Filtered prescriptions by ${filterType}`,
    result: filteredPrescriptions,
  };
};


const selectPrescription = async (prescriptionID: string) => {
  try {
    // Fetch prescriptions for the given patient and doctor
    const prescriptions = await PrescriptionModel.find({ prescriptionID });

    if (!prescriptions || prescriptions.length === 0) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: 'No prescriptions found for the given patient and doctor',
        result: [],
      };
    }

    // Return the prescriptions
    return {
      status: StatusCodes.OK,
      message: 'Prescriptions for the patient and doctor',
      result: prescriptions,
    };
  } catch (error) {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error while fetching prescriptions',
      result: [],
    };
  }
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