import express from 'express';
import controller from '../controllers/controller';
import { isAuthenticated, isAuthorized, queryParser } from '../middlewares';
import { getPatients, selectPatient } from '../services/doctor.service';
const UserMeRouter = express.Router();

UserMeRouter.get('/me/patient/', (req, res) => controller(res)(getPatients)(req.body.doctorID, req.query));
UserMeRouter.get('/me/patient/:id', (req, res) => controller(res)(selectPatient)(req.body.doctorID, req.params.id));
UserMeRouter.put('/me/info/', (req, res) => {
  //   controller(res)(updateInfo)(req.body);
});

export default UserMeRouter;
