const { v4: uuidv4 } = require('uuid');
import { HttpError } from '../utils';

import StatusCodes from 'http-status-codes';
import { Contract, Appointment, IDoctor, Doctor, Request, Patient, Package } from '../models';

const getMyPatients = async (query: any) => {
  const patientIDs = await Appointment.find(query).distinct('patientID');
  if (!patientIDs) return new HttpError(StatusCodes.NOT_FOUND, 'No patients with this doctor');

  const patients = await Patient.find({ _id: { $in: patientIDs } });

  return {
    status: StatusCodes.OK,
    message: 'Patients retrieved successfully',
    result: patients
  };
};

const calculateTimeStamp = (slot: { hours: number; minutes: number }) => slot.hours * 60 + slot.minutes;

const getDoctors = async (query: any) => {
  let { date, ...newQuery } = query;
  if (newQuery.specialty) newQuery.specialty = new RegExp(newQuery.specialty, 'i');
  if (newQuery.name) newQuery.name = new RegExp(newQuery.name, 'i');

  let doctors: IDoctor[] = await Doctor.find(newQuery); // .find({ isContractAccepted: true });

  if (date) {
    date = new Date(date);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day: string = daysOfWeek[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const inputTimeStamp = calculateTimeStamp({ hours, minutes });
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

  return {
    status: StatusCodes.OK,
    message: 'Doctors retrieved successfully',
    result: doctors
  };
};

const viewAvailableAppointments = async (doctorID: string) => {
  const doctor = await Doctor.findById(doctorID);
  if (!doctor) throw new HttpError(StatusCodes.NOT_FOUND, 'Doctor not found');

  const weeklySlots = doctor.weeklySlots;
  if (!weeklySlots) throw new HttpError(StatusCodes.NOT_FOUND, 'No available appointments for this doctor');

  let availableAppointments = {};

  const thisDay = new Date();
  const currentYear = thisDay.getUTCFullYear();
  const currentMonth = thisDay.getUTCMonth();
  const currentDate = thisDay.getUTCDate();
  const currentDay = thisDay.getUTCDay();
  const lastDay = currentDay + 6;

  // Get all doctor's appointments
  const appointments = await Appointment.find({ doctorID, status: 'Upcoming' });

  for (let i = currentDay; i <= lastDay; i++) {
    const dayOfWeek = i % 7;
    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    const dailySlots = weeklySlots[day as keyof typeof weeklySlots];

    (availableAppointments as any)[day] = []; // Initialize the day as an array
    for (const slot of dailySlots) {
      const slotHour = slot.from.hours;
      const slotMinute = slot.from.minutes;
      const slotHourEnd = slot.to.hours;
      const slotMinuteEnd = slot.to.minutes;

      let isSlotAvailable = true;
      for (const appointment of appointments) {
        const appointmentStartDate = appointment.startDate;
        const appointmentYear = appointmentStartDate.getUTCFullYear();
        const appointmentMonth = appointmentStartDate.getUTCMonth();
        const appointmentDate = appointmentStartDate.getUTCDate();
        const appointmentDay = appointmentStartDate.getUTCDay();
        const appointmentHour = appointmentStartDate.getUTCHours();
        const appointmentMinute = appointmentStartDate.getUTCMinutes();

        if (
          appointmentYear === currentYear &&
          appointmentMonth === currentMonth &&
          appointmentDate >= currentDate &&
          appointmentDate <= currentDate + 6 &&
          appointmentDay % 7 === dayOfWeek &&
          slotHour === appointmentHour &&
          slotMinute === appointmentMinute
        ) {
          isSlotAvailable = false;
          break;
        }
      }

      if (isSlotAvailable) {
        const startDate = new Date(
          currentYear,
          currentMonth,
          currentDate + i - currentDay,
          slotHour + 2,
          slotMinute,
          0,
          0
        );
        const endDate = new Date(
          currentYear,
          currentMonth,
          currentDate + i - currentDay,
          slotHourEnd + 2,
          slotMinuteEnd,
          0,
          0
        );

        const price = Math.floor(doctor.hourRate * (slotHourEnd - slotHour + (slotMinuteEnd - slotMinute) / 60));

        const id = uuidv4();

        const slot = {
          status: 'Upcoming',
          sessionPrice: price,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          isFollowUp: false,
          _id: id
        };

        (availableAppointments as any)[day].push(slot);
      }
    }
  }

  return {
    status: StatusCodes.OK,
    message: 'Available Appointments retrieved successfully',
    result: availableAppointments
  };
};

const viewContract = async (id: String) => {
  const request = await Request.findOne({ medicID: id });
  if (request?.status !== 'Approved') throw new HttpError(StatusCodes.BAD_REQUEST, 'Doctor not approved yet');

  const contract = await Contract.find({ doctorID: id });
  if (!contract) throw new HttpError(StatusCodes.NOT_FOUND, 'No contract for this doctor');

  return {
    status: StatusCodes.OK,
    message: 'contract retrieved successfully',
    result: contract
  };
};

const acceptContract = async (id: String) => {
  const contract = await viewContract(id);

  if (contract.result.length > 0 && contract.result[0].status === 'Pending') {
    const doctor: any = await Doctor.findOne({ _id: id });
    doctor.isContractAccepted = true;
    await doctor.save();

    contract.result[0].status = 'Accepted';
    await contract.result[0].save();

    return {
      status: StatusCodes.OK,
      message: 'Contract Accepted successfully',
      result: doctor
    };
  }
};

const addSlots = async (doctorID: string, newSlots: any) => {
  const doctor: any = await Doctor.findById(doctorID);
  if (!doctor) throw new HttpError(StatusCodes.NOT_FOUND, 'Doctor not found');

  if (!doctor.isContractAccepted) throw new HttpError(StatusCodes.BAD_REQUEST, 'Doctor has no Contract');

  const validDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  if (!validDays.includes(newSlots.day)) throw new HttpError(StatusCodes.BAD_REQUEST, 'Invalid day');

  const incomingSlotStart = newSlots.slots[0].from.hours * 60 + newSlots.slots[0].from.minutes;
  const incomingSlotEnd = newSlots.slots[0].to.hours * 60 + newSlots.slots[0].to.minutes;

  const daySlots = doctor.weeklySlots[newSlots.day] || [];
  for (const slot of daySlots) {
    const slotStart = slot.from.hours * 60 + slot.from.minutes;
    const slotEnd = slot.to.hours * 60 + slot.to.minutes;

    if (incomingSlotStart < slotEnd && incomingSlotEnd > slotStart) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Time slot conflict detected');
    }
  }

  doctor.weeklySlots[newSlots.day].push(...newSlots.slots);

  doctor.weeklySlots[newSlots.day].sort((a: any, b: any) => {
    return a.from.hours * 60 + a.from.minutes - (b.from.hours * 60 + b.from.minutes);
  });

  await doctor.save();

  return {
    status: StatusCodes.OK,
    message: 'Time slot added successfully',
    result: doctor.weeklySlots
  };
};

const scheduleFollowUp = async (doctorID: String, appointmentDetails: any) => {
  const doctor: any = await Doctor.findOne({ _id: doctorID });
  if (!doctor) throw new HttpError(StatusCodes.NOT_FOUND, 'Doctor not found');
  if (!doctor.isContractAccepted) throw new HttpError(StatusCodes.BAD_REQUEST, 'Doctor has no contract');

  const patient = await Patient.findOne({ email: appointmentDetails.email });
  if (!patient) throw new HttpError(StatusCodes.NOT_FOUND, 'Patient not found');

  let sessionDiscount = 0;
  if (patient.package) {
    const pkg = await Package.findOne({ _id: patient.package.packageID });
    if (pkg && patient.package!.endDate?.getTime() >= Date.now()) sessionDiscount = pkg.sessionDiscount;
  }

  const contract: any = await Contract.findOne({ doctorID: doctorID });

  const time =
    (new Date(appointmentDetails.endDate).getTime() - new Date(appointmentDetails.startDate).getTime()) /
    (1000 * 60 * 60);
  let price = doctor.hourRate * time * (1 + contract.markUpProfit / 100);
  price -= price * (sessionDiscount / 100);

  const followUpAppointment = new Appointment({
    doctorID: doctorID,
    patientID: patient._id,
    status: 'Upcoming',
    sessionPrice: price,
    startDate: appointmentDetails.startDate,
    endDate: appointmentDetails.endDate,
    isFollowUp: true
  });

  await followUpAppointment.save();

  return {
    status: StatusCodes.OK,
    message: 'Follow up appointment scheduled successfully',
    result: followUpAppointment
  };
};

export {
  getDoctors,
  getMyPatients,
  viewAvailableAppointments,
  viewContract,
  acceptContract,
  addSlots,
  scheduleFollowUp
};
