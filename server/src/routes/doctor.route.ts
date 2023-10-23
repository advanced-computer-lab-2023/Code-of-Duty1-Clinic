import express, { Request, Response } from 'express';

import controller from '../controllers';
import { getDoctors } from '../services';

const router = express.Router();

router.get('/:id', (req: Request, res: Response) => {
  controller(res)(getDoctors)({ _id: req.params.id });
});

router.get('/', (req: Request, res: Response) => {
  controller(res)(getDoctors)(req.query);
});

export default router;
