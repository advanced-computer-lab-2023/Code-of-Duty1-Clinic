import express, { Request, Response } from 'express';
import controller from '../controllers/controller';
import { isAuthenticated, isAuthorized, queryParser } from '../middlewares';
import { getPatients, selectPatient, getAllDoctor } from '../services/doctor.service';
import { addFamilyMember, getFamily, getPatient, viewAllDoctorsForPatient } from '../services//patient.service';
import { filterAppointment, getPatients2 } from '../services/appointment.service';
import { decodeJWTToken } from '../middlewares/authorization';
import { addAdmin, deleteUser, deleteUsers, getUsers, updateInfo, getDoctorsRequests } from '../services/user.service';
const router = express.Router();

router.get('/me/patient/:id', (req, res) => controller(res)(selectPatient)(req.body.doctorID, req.params.id));
router.get('/me/patient/', (req, res) => controller(res)(getPatients)('6529b7ad09214ecfa238eb44', req.query));
router.get('/', (req, res) => controller(res)(getUsers)(req.query));
router.put('/me/info/', (req, res) => {
  controller(res)(updateInfo)(req.body);
});
router.post('/me/family', (req, res) => {
  // TODO if login is used we should add the patient id in the body form the jwt token
  controller(res)(addFamilyMember)(req.body);
});
router.get('/me/family', (req, res) => {
  // TODO if login is used we should add the patient id in the body form the jwt token
  controller(res)(getFamily)(req.body.patientID);
});
router.get('/me/appointments', (req, res) => {
  controller(res)(filterAppointment)(req.query);
});
router.get('/me/doctor/patient', (req, res) => {
  controller(res)(getPatients2)('6529b7ad09214ecfa238eb44');
});
router.get('/me/patient/:id/info', (req, res) => {
  controller(res)(getPatient)(req.params.id);
});
router.get('/me/patient/:id/info/medicalhistory', (req, res) => {
  controller(res)(getPatient)(req.params.id, true);
});
router.get('/doctors', (req: Request, res: Response) => {
  if (req.body.decodedToken) {
    // req.body.decodedToken is added by decodeJWTToken middleware
    const id = req.body.decodedToken.id;
    const role = req.body.decodedToken.role;
    delete req.body.decodedToken; // no need to keep in the body
    if (role === 'Patient') return controller(res)(viewAllDoctorsForPatient)(id, req.query);
  }
  if (req.body.role === 'Patient' && req.body.id) {
    return controller(res)(viewAllDoctorsForPatient)(req.body.id, req.query);
  }
  controller(res)(getAllDoctor)(req.query);
});
//admin to show request
router.get('/doctors/requests', (req: Request, res: Response) =>
  controller(res)(getDoctorsRequests)({ role: 'Doctor', ...req.query })
);

router.get('/:id', (req: Request, res: Response) => controller(res)(getUsers)({ _id: req.params.id }));

router.post('/', (req: Request, res: Response) => {
  controller(res)(addAdmin)(req.body);
});
router.delete('/', (req: Request, res: Response) => {
  controller(res)(deleteUsers)();
});
router.delete('/:id', (req: Request, res: Response) => {
  controller(res)(deleteUser)(req.params.id);
});

export default router;
