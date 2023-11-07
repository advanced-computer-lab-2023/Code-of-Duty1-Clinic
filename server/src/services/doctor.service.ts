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

  const availableAppointments = [];

  const thisDay = new Date();
  const currentYear = thisDay.getUTCFullYear();
  const currentMonth = thisDay.getUTCMonth();
  const currentDate = thisDay.getUTCDate();
  const currentDay = thisDay.getUTCDay();
  const lastDay = currentDay + 6;

  // Get all doctor's appointments
  const appointments = await Appointment.find({
    doctorID: doctorID
  });

  for (let i = currentDay; i <= lastDay; i++) {
    const dayOfWeek = i % 7;
    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    const dailySlots = weeklySlots[day as keyof typeof weeklySlots];
    const availableSlots = dailySlots.filter((slot) => {
      const slotHour = slot.from.hours;
      const slotMinute = slot.from.minutes;
      for (let j = 0; j < appointments.length; j++) {
        const appointment = appointments[j];
        const appointmentStartDate = appointment.startDate;
        const appointmentYear = appointmentStartDate.getUTCFullYear();
        const appointmentMonth = appointmentStartDate.getUTCMonth();
        const appointmentDate = appointmentStartDate.getUTCDate();
        const appointmentDay = appointmentStartDate.getUTCDay();
        const appointmentHour = appointmentStartDate.getUTCHours();
        const appointmentMinute = appointmentStartDate.getUTCMinutes();
        // Check if the appointment is between the current date and the next 7 days
        if (
          appointmentYear === currentYear &&
          appointmentMonth === currentMonth &&
          appointmentDate >= currentDate &&
          appointmentDate <= currentDate + 6 &&
          appointmentDay % 7 === dayOfWeek &&
          slotHour === appointmentHour &&
          slotMinute === appointmentMinute
        ) {
          return false;
        }
      }
      return true;
    });

    const fullDate = new Date(currentYear, currentMonth, currentDate + 1 + i - currentDay);

    availableAppointments.push({
      day,
      date: fullDate,
      slots: availableSlots
    });
  }

  return {
    status: StatusCodes.OK,
    message: 'Available Appointments retrieved successfully',
    result: availableAppointments
  };
};

export { getDoctors, getMyPatients, viewAvailableAppointments };
