import StatusCodes from 'http-status-codes';

import { Prescription } from '../models';
import { HttpError } from '../utils';

const getPrescriptions = async (query: Object) => {
  const presecription = await Prescription.find(query);
  if (!presecription) throw new HttpError(StatusCodes.NOT_FOUND, 'no presecription found');

  return {
    status: StatusCodes.OK,
    result: presecription
  };
};

export { getPrescriptions };
