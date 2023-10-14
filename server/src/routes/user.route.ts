import express from 'express';
import controller from '../controllers/controller';
import { isAuthenticated, isAuthorized, queryParser } from '../middlewares';
import { getPatients, selectPatient } from '../services/doctor.service';
import { addFamilyMember } from '../services//patient.service';
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
export default UserMeRouter;
