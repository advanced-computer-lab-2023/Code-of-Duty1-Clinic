import { HttpError } from '../utils';
import StatusCodes from 'http-status-codes';
import { User, Contract, Appointment, IPatient, IDoctor, Doctor,Request } from '../models';

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
const getPath = (files: any) => { 
  let results = [];
  for (let i = 0; i < files.length; i++) { 
    const idx = files[i].path.indexOf('uploads');
    results.push(files[i].path.slice(idx));
  }
return  results;

}
const saveRegistrationFiles = (doctorID: string, files: any) => {

  const IDFiles = files.ID;
  const degreeFiles = files.medicalDegree;
  const licensesFields = files.medicalLicenses;
  let IDPath = getPath(IDFiles)[0];
  let degreePath: any[] = getPath(degreeFiles);
  let licensePath: any[] = getPath(licensesFields);
  
  const results = Request.findOneAndUpdate({ medicID: doctorID }, {
    ID: IDPath,
    $push: {
      degree: { $each: degreePath },
      licenses: { $each: licensePath }
    }
  });
  return {
    result: results,
    status: StatusCodes.OK,
    message: "Registration Documents uploaded successfully"
  }

}
export { getDoctors, getMyPatients,saveRegistrationFiles };
