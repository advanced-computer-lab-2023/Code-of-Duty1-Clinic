import express, { Request, Response } from 'express';

import controller from '../controllers';
import { isAuthenticated } from '../middlewares';
import {} from '../services';
import {stripe} from '../utils/stripe'

const router = express.Router();

router.use(isAuthenticated);

router.get("/prices",async(req,res) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_SECRET_KEY
  })
  return res.json(prices);
});

router.post('/session',async(req,res)=>{
  const session = await stripe.checkout.sessions.create({
    mode : "subscription",
    payment_method_types:["card"],
    line_items: [
      {
        price: req.body.priceID, // problem here
        quantity: 1
      }
    ],

    success_url: "http://localhost:3030",
    cancel_url: "http://localhost:3030",
    customer : "cus_P02l6C1LLVGNmW", //fixed customerID in stripe


  },{
    apiKey: process.env.STRIPE_SECRET_KEY,
  })
});

router.post('/payment/checkout', (req: Request, res: Response) => {
  // Handle payment checkout logic here
  //   controller(res)()();
});

export default router;
