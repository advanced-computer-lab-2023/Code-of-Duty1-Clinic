import express, { Request, Response } from 'express';
import controller from '../controllers/controller';
import { isAuthenticated, isAuthorized, queryParser } from '../middlewares';
import { getPatients, selectPatient, getAllDoctor } from '../services/doctor.service';
import { addFamilyMember, getFamily, getPatient, viewAllDoctorsForPatient } from '../services//patient.service';
import { filterAppointment } from '../services/appointment.service';
import { userRouter } from '.';
import { decodeJWTToken } from '../middlewares/authorization';
const UserMeRouter = express.Router();

UserMeRouter.get('/me/patient/', (req, res) => controller(res)(getPatients)(req.body.doctorID, req.query));
UserMeRouter.get('/me/patient/:id', (req, res) => controller(res)(selectPatient)(req.body.doctorID, req.params.id));
UserMeRouter.put('/me/info/', (req, res) => {
  //   controller(res)(updateInfo)(req.body);
});
UserMeRouter.post('/me/family', (req, res) => {
  // TODO if login is used we should add the patient id in the body form the jwt token
  controller(res)(addFamilyMember)(req.body);
});
UserMeRouter.get('/me/family', (req, res) => {
  // TODO if login is used we should add the patient id in the body form the jwt token
  controller(res)(getFamily)(req.body.patientID);
});
UserMeRouter.get('/me/appointments', (req, res) => {
  controller(res)(filterAppointment)(req.query);
});
UserMeRouter.get('/me/patient/:id/info', (req, res) => {
  controller(res)(getPatient)(req.params.id);
});
UserMeRouter.get('/me/patient/:id/info/medicalhistory', (req, res) => {
  controller(res)(getPatient)(req.params.id, true);
});
UserMeRouter.get('/doctors', (req: Request, res: Response) => {
  if (req.body.decodedToken) {
    // req.body.decodedToken is added by decodeJWTToken middleware
    const id = req.body.decodedToken.id;
    const role = req.body.decodedToken.role;
    delete req.body.decodedToken; // no need to keep in the body
    if (role === 'Patient') return controller(res)(viewAllDoctorsForPatient)(id, req.query);
  }

  controller(res)(getAllDoctor)(req.query);
});
export default UserMeRouter;
