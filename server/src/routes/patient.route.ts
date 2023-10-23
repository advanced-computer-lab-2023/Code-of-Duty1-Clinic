import express, { Request, Response } from 'express';

import controller from '../controllers';
import { getMyPatients } from '../services';
import { isAuthenticated, isAuthorized } from '../middlewares';

const router = express.Router();

router.use(isAuthenticated);
router.use(isAuthorized('Doctor'));

router.get('/:id', (req: Request, res: Response) => {
  controller(res)(getMyPatients)({ doctorID: req.decoded.id, patientID: req.params.id });
});
router.get('/', (req: Request, res: Response) => {
  controller(res)(getMyPatients)({ doctorID: req.decoded.id });
});

router.get('/:id/medicalhistory', (req: Request, res: Response) => {
  // controller(res)()();
});
router.post('/:id/medicalhistory', (req: Request, res: Response) => {
  // Handle medical history update logic here
  // notice that doctors can update patients medical history
  // controller(res)()();
});

export default router;
