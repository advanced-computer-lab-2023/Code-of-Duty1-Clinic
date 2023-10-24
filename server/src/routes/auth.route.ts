import express, { Request, Response } from 'express';

import controller from '../controllers';
import { isAuthenticated } from '../middlewares';
import { login, register } from '../services';
import { registrationUpload } from '../middlewares';

const router = express.Router();

router.post('/register', registrationUpload.fields([{ name: "id", maxCount: 1 }, {name: "licenses", maxCount: 10}, {name: "degrees", maxCount: 10}]) ,(req: Request, res: Response) => {
  controller(res)(register)(req.body,req.files);
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
