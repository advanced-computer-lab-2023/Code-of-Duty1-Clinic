import { HttpError } from '../utils';
import StatusCodes from 'http-status-codes';
import { User, Contract, Appointment, IPatient, IDoctor, Doctor, Patient, Package } from '../models';

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

const viewContract = async (id : String) =>{
  const contract =  await Contract.find({doctorID: id})
  const contt = Contract.find();
  console.log(contt);
  if (!contract) throw new HttpError(StatusCodes.NOT_FOUND, 'No contract for this doctor')

  return{
    status : StatusCodes.OK,
    message : 'contract retrieved successfully',
    result : contract
  };
}

const acceptContract = async (id : String) =>{
  const contract = await viewContract(id);

  if (contract.result.length > 0 && contract.result[0].status === "Pending") {
    const doctor: any = await Doctor.findOne({_id: id})
    doctor.isContractAccepted = true;
    await doctor.isContractAccepted.save();
    contract.result[0].status = "Accepted";
    await contract.result[0].save();

    return {
      status: StatusCodes.OK,
      message: 'Contract Accepted successfully',
      result: ''
    };

  } else {
    return {
      status: StatusCodes.OK,
      message: 'Contract is already Assigned or there is no contarct for this doctor',
      result: ''
    };
  }
};

const addSlots = async (id: string, newSlots: any) => {
  const doctor: any = await Doctor.findOne({_id: id})

    if (!doctor) throw new HttpError(StatusCodes.NOT_FOUND, 'Doctor not found');
  
    doctor.weeklySlots[newSlots.day].push(newSlots.timeSlots);
    await doctor.save();

    return {
      status: StatusCodes.OK,
      message: 'Available time slots added successfully',
      result: ''
    };
};

const scheduleFollowUp = async (doctorID: String, appointmentDetails: any) => {
   const doctor: any = await Doctor.findOne({_id: doctorID})
   if (!doctor) throw new HttpError(StatusCodes.NOT_FOUND, 'Doctor not found');
   if (!doctor.isContractAccepted) throw new HttpError(StatusCodes.NOT_FOUND, 'Doctor has no contract');

   const patient = await Patient.findOne({email : appointmentDetails.email});
   if (!patient) throw new HttpError(StatusCodes.NOT_FOUND, 'Patient not found');

   let sessionDiscount = 0;
   if (patient.package) {
     const pkg = await Package.findOne({ _id: patient.package.packageID });
     if (pkg && patient.package!.endDate?.getTime() >= Date.now()) sessionDiscount = pkg.sessionDiscount;
   }

   const { hourRate, contract } = doctor;
   let price = hourRate;
   price -= price * (sessionDiscount / 100)

   const followUpAppointment = new Appointment({
     doctorID: doctorID,
     patientID: patient._id,
     status: 'Upcoming', 
     sessionPrice: price,
     startDate: appointmentDetails.startDate,
     endDate: appointmentDetails.endDate, 
     isFollowUp: true,
  });

  await followUpAppointment.save();

  return {
    status: StatusCodes.OK,
    message: 'Follow up appointment scheduled successfully',
    result: followUpAppointment,
  };
};

export { getDoctors, getMyPatients, viewContract, acceptContract, addSlots, scheduleFollowUp};
