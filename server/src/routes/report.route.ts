import express, { Request, Response } from 'express';
import controller from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';
import { getReport } from '../services/report.service';

const router = express.Router();

router.use(isAuthenticated);
router.use(isAuthorized('Pharmacist'));
router.get('/', (req: Request, res: Response) => {
  controller(res)(getReport)(req.query, req.body);
});
export default router;
