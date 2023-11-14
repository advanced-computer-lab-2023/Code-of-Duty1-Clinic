import express, { Request, Response } from 'express';
import controller from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';
import { getPackages, addPackage, updatePackage, deletePackage } from '../services/package.service';

const router = express.Router();

router.get('/:id', (req: Request, res: Response) => {
  controller(res)(getPackages)({ _id: req.params.id });
});

router.get('/', (req: Request, res: Response) => {
  controller(res)(getPackages)(req.query)
});

router.use(isAuthenticated);
router.use(isAuthorized('Admin'));

router.post('/', (req: Request, res: Response) => {
  controller(res)(addPackage)(req.body);
});

router.put('/:id', (req: Request, res: Response) => {
  controller(res)(updatePackage)(req.params.id, req.body);
});

router.delete('/:id', (req: Request, res: Response) => {
  controller(res)(deletePackage)(req.params.id);
});

export default router;
