import express, { Request, Response } from 'express';

import controller from '../controllers';
import { getRequests, acceptRequest, rejectRequest} from '../services';
import { isAuthenticated, isAuthorized } from '../middlewares';

const router = express.Router();

router.use(isAuthenticated);
router.use(isAuthorized('Admin'));

router.get('/', (req: Request, res: Response) => {
  controller(res)(getRequests)();
});

router.put('/accept', (req: Request, res: Response) => {
  controller(res)(acceptRequest)(req.body.email);
});

router.put('/reject', (req: Request, res: Response) => {
  controller(res)(rejectRequest)(req.body.email);
});

export default router;
