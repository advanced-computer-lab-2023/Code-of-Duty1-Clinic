import express, { Request, Response } from 'express';

import controller from '../controllers';
import { getRequests } from '../services';
import { isAuthenticated, isAuthorized } from '../middlewares';

const router = express.Router();

router.use(isAuthenticated);
router.use(isAuthorized('Admin'));

router.get('/', (req: Request, res: Response) => {
  controller(res)(getRequests)();
});

router.put('/:id', (req: Request, res: Response) => {
  // controller(res)()();
});

export default router;
