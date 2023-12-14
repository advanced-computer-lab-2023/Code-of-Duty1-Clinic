import express, { Request, Response } from 'express';

import controller from '../controllers';
import { isAuthenticated } from '../middlewares';
import { getCart, removeCartItem, increaseItemCount, decreaseItemCount, addCartItem } from '../services';

const router = express.Router();

router.use(isAuthenticated);

router.get('/', (req: Request, res: Response) => {
  controller(res)(getCart)(req.decoded.id);
});

router.post('/', (req: Request, res: Response) => {
  controller(res)(addCartItem)(req.decoded.id, req.body.medID, req.body.prescriptionID, req.body.medicineID);
});

router.delete('/:id', (req: Request, res: Response) => {
  controller(res)(removeCartItem)(req.decoded.id, req.params.id);
});

router.patch('/increase/:id', (req: Request, res: Response) => {
  controller(res)(increaseItemCount)(req.decoded.id, req.params.id);
});
router.patch('/decrease/:id', (req: Request, res: Response) => {
  controller(res)(decreaseItemCount)(req.decoded.id, req.params.id);
});

export default router;
