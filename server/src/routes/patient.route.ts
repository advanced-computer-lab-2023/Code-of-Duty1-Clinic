import express, { Request, Response } from 'express';

import controller from '../controllers';
import { addHealthRecord, getHealthRecords, getMyPatients } from '../services';
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

router.get('/:id/medicalhistory', isAuthorized('Doctor'), (req: Request, res: Response) => {
  controller(res)(getHealthRecords)(req.params.id);
});

router.post('/:id/medicalhistory', isAuthorized('Doctor'), (req: Request, res: Response) => {
  controller(res)(addHealthRecord)(req.params.id, req.body);
});

export default router;
