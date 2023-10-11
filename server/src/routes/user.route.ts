import express from 'express';
const router = express.Router();

import controller from '../controllers/controller';
import { isAuthenticated, isAuthorized, queryParser } from '../middlewares';

// import the user service
import { getPatients, selectPatient } from '../services/userService';
import { updateInfo } from '../services/user/user.service';
// http methods required for this router

router.get('/me/patient/', async (req, res) => controller(res)(getPatients)(req.query.doctorID));
router.get('/me/patient/:id', async (req, res) => controller(res)(selectPatient)(req.query.doctorID, req.params.id));
router.put('/me/info/', (req, res) => {
  controller(res)(updateInfo)(req.body);
});

export default router;
