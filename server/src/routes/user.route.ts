import express from 'express';
const router = express.Router();

import controller from '../controllers/controller';
import { isAuthenticated, isAuthorized, queryParser } from '../middlewares';

// import the user service
import getPatients from '../services/userService';
import getPatientsByName from '../services/userService';
import getUpcomingPatients from '../services/userService';
import selectPatient from '../services/userService';

// http methods required for this router

//

export default router;
