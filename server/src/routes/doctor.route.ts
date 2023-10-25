import express, { Request, Response } from 'express';

import controller from '../controllers';
import { getDoctors } from '../services';
import { isAuthenticated, isAuthorized } from '../middlewares';

const router = express.Router();
router.use(isAuthenticated);

router.get('/:id', (req: Request, res: Response) => {
  controller(res)(getDoctors)({ _id: req.params.id });
});

router.get('/', (req: Request, res: Response) => {
  controller(res)(getDoctors)(req.query);
});

//I'll edit them later
/*
router.get('/:id/appointments', isAuthorized('Patient'), (req: Request, res: Response) => {
  controller(res)(getDoctorAppointments)(req.decoded.id, req.params.id);
});

router.post('/:id/appointments', (req: Request, res: Response) => {
  controller(res)(createAppointment)(req.decoded.id, req.params.id, req.body);
});
*/

export default router;
