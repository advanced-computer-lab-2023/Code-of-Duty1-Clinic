import express, { Request, Response } from 'express';
import { login, register } from '../services/auth.service';
import controller from '../controllers/controller';

const router = express.Router();

router.post('/register', (req: Request, res: Response) => {
  controller(res)(register)(req.body);
});

router.post('/login', (req: Request, res: Response) => {
  controller(res)(login)(req.body);
});

export default router;
