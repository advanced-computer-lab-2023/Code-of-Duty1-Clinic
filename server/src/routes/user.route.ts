import express from 'express';
import controller from '../controllers/controller';
import { isAuthenticated, isAuthorized, queryParser } from '../middlewares';
import { getPatients, selectPatient } from '../services/doctor.service';
const UserMeRouter = express.Router();

UserMeRouter.get('/me/patient/', async (req, res) => controller(res)(getPatients)(req.query.doctorID));
UserMeRouter.get('/me/patient/:id', async (req, res) =>
  controller(res)(selectPatient)(req.query.doctorID, req.params.id)
);
UserMeRouter.put('/me/info/', (req, res) => {
  //   controller(res)(updateInfo)(req.body);
});

export default UserMeRouter;
