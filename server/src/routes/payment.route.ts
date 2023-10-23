import express, { Request, Response } from 'express';

import controller from '../controllers';
import { isAuthenticated } from '../middlewares';
import {} from '../services';

const router = express.Router();

router.use(isAuthenticated);

router.post('/payment/checkout', (req: Request, res: Response) => {
  // Handle payment checkout logic here
  //   controller(res)()();
});

export default router;
