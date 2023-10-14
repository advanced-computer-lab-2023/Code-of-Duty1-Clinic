import express, { Request, Response } from 'express';

import controller from '../controllers/controller';
import { isAuthenticated, isAuthorized, isResourceOwner } from '../middlewares';
import { getPrescriptions } from '../services/prescription.service';

const router = express.Router();

// TODO: Modify in sprint 2
router.get('me', (req, res) => controller(res)(getPrescriptions)({ _id: req.body.id }));
router.get('me/:id', (req, res) => controller(res)(getPrescriptions)({ _id: req.body.id, patiendID: req.params.id }));

router.get(':patientID', (req, res) => controller(res)(getPrescriptions)({ patiendID: req.params.patientID }));
router.get(':patientID/:id', (req, res) =>
  controller(res)(getPrescriptions)({ _id: req.params.id, patiendID: req.params.patientID })
);

export default router;
