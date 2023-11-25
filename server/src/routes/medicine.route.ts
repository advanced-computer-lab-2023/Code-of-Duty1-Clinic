import express, { Request, Response } from 'express';

import { isAuthenticated, isAuthorized } from '../middlewares';
import controller from '../controllers';
import { getMedicines, addMedicine, updateMedicine } from '../services';

const router = express.Router();

// ToDO
router.get('/:id', (req: Request, res: Response) => {
  controller(res)(getMedicines)({ _id: req.params.id });
});
router.get('/', (req: Request, res: Response) => {
  controller(res)(getMedicines)(req.query);
});

router.use(isAuthenticated);
router.use(isAuthorized('Pharmacist'));
router.post('/', (req: Request, res: Response) => {
  controller(res)(addMedicine)(req.body);
});

router.put('/:id', (req: Request, res: Response) => {
  controller(res)(updateMedicine)(req.params.id, req.body);
});

export default router;
