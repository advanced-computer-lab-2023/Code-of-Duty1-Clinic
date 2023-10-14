import express, { Request, Response } from 'express';
import { login, logout, register, changePassword } from '../services/auth.service';
import controller from '../controllers/controller';
const loginRouter = express.Router();

loginRouter.post('/register/patient', (req: Request, res: Response) => {
  controller(res)(register)(req.body);
});
loginRouter.post('/register/doctor', (req: Request, res: Response) => {
  controller(res)(register)(req.body);
});
loginRouter.post('/login', (req: Request, res: Response) => {
  const userData = req.body;
  const userName = req.body.username;
  const password = req.body.password;
  delete req.body.password;
  controller(res)(login)(userName, password);
});

export default loginRouter;
