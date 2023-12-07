import express, { Request, Response } from 'express';

import controller from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';
import { addOrder, getOrders, updateOrder, cancelOrder, getAllOrders } from '../services';
// import { getOrders, addOrder, updateOrder } from '../services';

const router = express.Router();

router.use(isAuthenticated);

router.get('/:id', (req: Request, res: Response) => {
  controller(res)(getOrders)({ _id: req.params.id }, req.decoded.id);
});
router.get('/', (req: Request, res: Response) => {
  controller(res)(getOrders)(req.query, req.decoded.id);
});

router.post('/', (req: Request, res: Response) => {
  // console.log(req.decoded.id);
  controller(res)(addOrder)(req.decoded.id, req.body);
});

// Refer to https://github.com/3laaHisham/MarketNexus-API/blob/main/routes/order.route.js
// to see how to implement the following route (to make sure me is the owner of the order)

router.put('/:id/cancel', (req: Request, res: Response) => {
  controller(res)(cancelOrder)(req.params.id);
});
router.put('/:id', (req: Request, res: Response) => {
  controller(res)(updateOrder)(req.params.id, req.body);
});
router.use(isAuthorized('Pharmacist'));
router.get('/all', (req: Request, res: Response) => {
  controller(res)(getAllOrders)(req.query);
});
// Optional
// router.use(isAuthorized('Pharmacist'));

// router.put('/:id/complete', (req: Request, res: Response) => {
//   controller(res)(updateOrder)(req.params.id, { status: 'Completed' });
// });

export default router;
