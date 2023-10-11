import PrescriptionModel from '../models/prescription.model';
import { HttpError } from '../utils';
import StatusCodes from 'http-status-codes';
const getAllPrescription = async (patientID: string) => {
  const presecription = await PrescriptionModel.find({ patientID: patientID });
  return {
    status: StatusCodes.OK,
    message: 'here all presecription',
    result: presecription
  };
};
