import StatusCodes from 'http-status-codes';

import PrescriptionModel from '../models/prescription.model';
import { HttpError } from '../utils';

const getPrescriptions = async (query: Object) => {
  const presecription = await PrescriptionModel.find(query);
  if (!presecription) throw new HttpError(StatusCodes.NOT_FOUND, 'no presecription found');

  return {
    status: StatusCodes.OK,
    result: presecription
  };
};

export { getPrescriptions };
