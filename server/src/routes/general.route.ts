import express, { Request, Response } from 'express';
import { login, logout, register, changePassword } from '../services/auth';
import controller from '../controllers/controller';
import { viewAllDoctorsForPatient } from '../services/patient';
import { getAllDoctor } from '../services/doctor';

import { decodeJWTToken } from '../middlewares/authorization';

const generalRouter = express.Router();
generalRouter.get('/users/doctor'),
  decodeJWTToken,
  (req: Request, res: Response) => {
    if (req.body.decodedToken) {
      // req.body.decodedToken is added by decodeJWTToken middleware
      const id = req.body.decodedToken.id;
      const role = req.body.decodedToken.role;
      delete req.body.decodedToken; // no need to keep in the body
      if (role === 'Patient') return controller(res)(viewAllDoctorsForPatient)(id);
    }
    controller(res)(getAllDoctor)();
  };
export default generalRouter;
