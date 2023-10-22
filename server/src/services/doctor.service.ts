import { HttpError } from '../utils';
import StatusCodes from 'http-status-codes';
import { User, Contract, Appointment, IPatient, IDoctor, Doctor } from '../models';

const getPatients = async (doctorID: string, query: any) => {
  const appointments = await Appointment.find({ doctorID })
    .find(query)
    .distinct('patientID')
    .select('patientID')
    .populate('patientID');

  if (!appointments) return new HttpError(StatusCodes.NOT_FOUND, 'No patients with this doctor');

  const patients = appointments.map((appointment: any) => appointment.patientID);

  return {
    status: StatusCodes.OK,
    message: 'Patients retrieved successfully',
    result: patients
  };
};

const calculateTimeStamp = (slot: { hours: number; minutes: number }) => slot.hours * 60 + slot.minutes;

const getAllDoctors = async (query: any) => {
  let doctors: IDoctor[] = await Doctor.find(query)
    .populate({
      path: 'contract',
      model: Contract
    })
    .find({ 'contract.status': 'Accepted' });

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

export { getAllDoctors, getPatients };
