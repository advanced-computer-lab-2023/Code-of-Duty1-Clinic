import express, { Request, Response } from 'express';

import controller from '../controllers';
import { isAuthenticated } from '../middlewares';
import { login, register, logout, changePassword, resetPassword, forgotPassword, verifyOTP } from '../services';

const router = express.Router();

router.post('/register' ,(req: Request, res: Response) => {
  controller(res)(register)(req.body,req.files);
});

router.post('/login', (req: Request, res: Response) => {
  controller(res)(login)(req.body);
});

router.post('/forgot-password', (req: Request, res: Response) => {
  controller(res)(forgotPassword)(req.body);
});

router.get('/verify-otp', (req: Request, res: Response) => {
  controller(res)(verifyOTP)(req.body);
});

router.put('/reset-password', (req: Request, res: Response) => {
  controller(res)(resetPassword)(req.body);
});

router.use(isAuthenticated);

router.post('/logout', (req: Request, res: Response) => {
  controller(res)(logout)(req.decoded.id);
});

router.put('/change-password', (req: Request, res: Response) => {
  controller(res)(changePassword)(req.decoded.id, req.body);
});

export default router;
