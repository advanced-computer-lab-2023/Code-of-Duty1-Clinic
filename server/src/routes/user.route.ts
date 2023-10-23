import express, { Request, Response } from 'express';

import controller from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';
import { addAdmin, deleteUser, getUsers } from '../services';

const router = express.Router();

router.use(isAuthenticated);
router.use(isAuthorized('Admin'));

router.post('/', (req: Request, res: Response) => {
  controller(res)(addAdmin)(req.body);
});
router.delete('/:id', (req: Request, res: Response) => {
  controller(res)(deleteUser)({ _id: req.params.id });
});
router.get('/:id', (req: Request, res: Response) => {
  controller(res)(getUsers)({ _id: req.params.id });
});
router.get('/', (req: Request, res: Response) => {
  controller(res)(getUsers)();
});

export default router;
