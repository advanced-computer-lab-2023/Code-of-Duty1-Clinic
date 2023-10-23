import express, { Request, Response } from 'express';

import controller from '../controllers';
import { isAuthenticated } from '../middlewares';
import { login, register } from '../services';

const router = express.Router();

router.post('/register', (req: Request, res: Response) => {
  controller(res)(register)(req.body);
});

router.post('/login', (req: Request, res: Response) => {
  controller(res)(login)(req.body);
});

router.use(isAuthenticated);

router.post('/logout', (req: Request, res: Response) => {
  // Handle logout logic here
});

router.put('/change-password', (req: Request, res: Response) => {
  // Handle change password logic here
});

router.put('/reset-password', (req: Request, res: Response) => {
  // Handle reset password logic here
});

export default router;
