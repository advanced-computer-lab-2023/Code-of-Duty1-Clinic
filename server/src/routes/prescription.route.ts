import express, { Request, Response } from 'express';

import controller from '../controllers';
import {
  updatePrescriptions,
  addMedicineToPrescription,
  deleteMedicineFromPrescription,
  editDosage
} from '../services';
import { isAuthenticated, isAuthorized } from '../middlewares';

const router = express.Router();

router.use(isAuthenticated);
router.use(isAuthorized('Doctor'));

router.put('/:id', isAuthorized('Doctor'), (req: Request, res: Response) => {
  controller(res)(updatePrescriptions)(req.params.id, req.body);
});

router.put('/:id/addmedicine', isAuthorized('Doctor'), (req: Request, res: Response) => {
  controller(res)(addMedicineToPrescription)(req.params.id, req.body);
});

router.put('/:id/deletemedicine', isAuthorized('Doctor'), (req: Request, res: Response) => {
  controller(res)(deleteMedicineFromPrescription)(req.params.id, req.body);
});

router.put('/:id/editDosage', isAuthorized('Doctor'), (req: Request, res: Response) => {
  controller(res)(editDosage)(req.params.id, req.body);
});

export default router;
