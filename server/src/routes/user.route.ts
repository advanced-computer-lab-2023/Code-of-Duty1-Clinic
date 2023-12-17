import express, { Request, Response } from 'express';

import controller from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';
import { addAdmin, deleteUsers, getUsers } from '../services';

const router = express.Router();

// Just for testing

router.use(isAuthenticated);
// router.use(isAuthorized('Admin'));

router.delete('/:id', (req: Request, res: Response) => {
  controller(res)(deleteUsers)({ _id: req.params.id });
});
router.delete('/', (req: Request, res: Response) => {
  controller(res)(deleteUsers)();
});

router.post('/', (req: Request, res: Response) => {
  console.log("PPPPPP");
  controller(res)(addAdmin)(req.body);
});

router.get('/:id', (req: Request, res: Response) => {
  controller(res)(getUsers)({ _id: req.params.id });
});
router.get('/', (req: Request, res: Response) => {
  controller(res)(getUsers)();
});

export default router;
