import { HttpError } from '../utils';
import StatusCodes from 'http-status-codes';
import { User, Contract, Appointment, IPatient, IDoctor, Doctor } from '../models';

const getMyPatients = async (query: any) => {
  const appointments = await Appointment.find(query).distinct('patientID').select('patientID').populate('patientID');
  if (!appointments) return new HttpError(StatusCodes.NOT_FOUND, 'No patients with this doctor');

  const patients = appointments.map((appointment: any) => appointment.patientID);

  return {
    status: StatusCodes.OK,
    message: 'Patients retrieved successfully',
    result: patients
  };
};

const calculateTimeStamp = (slot: { hours: number; minutes: number }) => slot.hours * 60 + slot.minutes;

const getDoctors = async (query: any) => {
  let doctors: IDoctor[] = await Doctor.find(query); // .find({ isContractAccepted: true });

  if (query.date) {
    const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const day: string = daysOfWeek[query.date.getDay()];
    const hours = query.date.getHours();
    const minutes = query.date.getMinutes();

    const inputTimeStamp = 60 * hours + minutes;
    doctors = doctors.filter((doctor: IDoctor) => {
      const slots = (doctor.weeklySlots as any)[day];

      for (let j = 0; j < slots.length; j++) {
        const slot = slots[j];
        const fromTimeStamp = calculateTimeStamp(slot.from);
        const toTimeStamp = calculateTimeStamp(slot.to);

        if (fromTimeStamp <= inputTimeStamp && inputTimeStamp <= toTimeStamp) return true;
      }
      return false;
    });
  }

  return { result: doctors, status: StatusCodes.OK };
};

const viewAvailableAppointments = async (doctorID: string) => {
  const doctor = await Doctor.findById(doctorID);
  if (!doctor) throw new HttpError(StatusCodes.NOT_FOUND, 'Doctor not found');

  const weeklySlots = doctor.weeklySlots;
  if (!weeklySlots) throw new HttpError(StatusCodes.NOT_FOUND, 'No available appointments for this doctor');

  let availableAppointments: any = {};

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (const dayOfWeek of daysOfWeek) {
    const dailySlots = weeklySlots[dayOfWeek as keyof typeof weeklySlots];
    let dailyAppointments = [];

    for (const slot of dailySlots) {
      if (!slot.isReserved) {
        dailyAppointments.push({
          from: `${slot.from.hours}:${slot.from.minutes}`,
          to: `${slot.to.hours}:${slot.to.minutes}`
        });
      }
    }

    if (dailyAppointments.length > 0) {
      availableAppointments[dayOfWeek] = dailyAppointments;
    }
  }

  return {
    status: StatusCodes.OK,
    message: 'Available Appointments retrieved successfully',
    result: availableAppointments
  };
};

export { getDoctors, getMyPatients, viewAvailableAppointments };
