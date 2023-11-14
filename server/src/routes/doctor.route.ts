import express, { Request, Response } from 'express';

import controller from '../controllers';
import { createAppointment, getDoctors, viewAvailableAppointments } from '../services';
import { isAuthenticated, isAuthorized } from '../middlewares';

const router = express.Router();
router.use(isAuthenticated);

router.get('/:id/availableAppointments', isAuthorized('Patient'), (req: Request, res: Response) => {
  controller(res)(viewAvailableAppointments)(req.params.id);
});

router.post('/:id/appointments', isAuthorized('Patient'), (req: Request, res: Response) => {
  controller(res)(createAppointment)(req.decoded.id, req.params.id, req.body);
});

router.get('/:id', (req: Request, res: Response) => {
  controller(res)(getDoctors)({ _id: req.params.id });
});

router.get('/', (req: Request, res: Response) => {
  controller(res)(getDoctors)(req.query);
});

export default router;
