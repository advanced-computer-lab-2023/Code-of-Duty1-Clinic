import express, { Request, Response } from 'express';
import controller from '../controllers/controller';
import { isAuthenticated, isAuthorized } from '../middlewares';
import { getPatients, selectPatient } from '../services/doctor.service';
import { addFamilyMember } from '../services/patient.service';
import { getUsers } from '../services/user.service';
const router = express.Router();

router.get('/me/patient/:id', (req, res) => controller(res)(selectPatient)(req.body.doctorID, req.params.id));
router.get('/me/patient/', (req, res) => controller(res)(getPatients)(req.body.doctorID, req.query));
router.put('/me/info/', (req, res) => {
  //   controller(res)(updateInfo)(req.body);
});
router.post('/me/family', (req, res) => {
  // TODO if login is used we should add the patient id in the body form the jwt token
  controller(res)(addFamilyMember)(req.body);
});

router.get('/doctors', (req: Request, res: Response) => controller(res)(getUsers)({ role: 'Doctor', ...req.query }));

router.get('/:id', (req: Request, res: Response) => controller(res)(getUsers)({ _id: req.params.id }));

export default router;
