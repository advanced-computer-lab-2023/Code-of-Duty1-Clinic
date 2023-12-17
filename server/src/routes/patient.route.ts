import express, { Request, Response } from 'express';

import controller from '../controllers';
import {
  addHealthRecord,
  addPrescription,
  getHealthRecords,
  getMyPatients,
  getPatientPrescriptions,
  getHealthPackage,
  cancelSubscribtion,
  subscribe
} from '../services';
import { isAuthenticated, isAuthorized } from '../middlewares';

const router = express.Router();

router.use(isAuthenticated);

router.get('/package', (req: Request, res: Response) => {
  controller(res)(getHealthPackage)(req.decoded.id);
});
router.post('/:id/package', (req: Request, res: Response) => {
  controller(res)(subscribe)(req.params.id, req.body.packageID);
});
router.delete('/:id/package', (req: Request, res: Response) => {
  controller(res)(cancelSubscribtion)(req.params.id);
});

router.use(isAuthorized('Doctor'));

router.get('/:id/medicalhistory', (req: Request, res: Response) => {
  controller(res)(getHealthRecords)(req.params.id);
});

router.post('/:id/medicalhistory', (req: Request, res: Response) => {
  controller(res)(addHealthRecord)(req.params.id, req.body);
});

router.get('/:id/prescription', (req: Request, res: Response) => {
  controller(res)(getPatientPrescriptions)(req.decoded.id, req.params.id);
});

router.post('/:id/prescription', (req: Request, res: Response) => {
  controller(res)(addPrescription)(req.decoded.id, req.params.id, req.body);
});

router.get('/:id', (req: Request, res: Response) => {
  controller(res)(getMyPatients)({ doctorID: req.decoded.id, patientID: req.params.id });
});
router.get('/', (req: Request, res: Response) => {
  controller(res)(getMyPatients)({ doctorID: req.decoded.id });
});

export default router;
