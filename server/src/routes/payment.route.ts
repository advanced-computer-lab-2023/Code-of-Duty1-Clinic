import express, { Request, Response } from 'express';

import controller from '../controllers';
import { isAuthenticated } from '../middlewares';
import {} from '../services';
import { stripe } from '../utils/stripe';

const router = express.Router();

router.use(isAuthenticated);

// router.get("/prices",async(req,res) => {
//   const prices = await stripe.prices.list({
//     apiKey: process.env.STRIPE_SECRET_KEY
//   })
//   return res.json(prices);
// });

interface Product {
  name: string;
  price: number;
  quantity: number;
}

router.post('/session/subscription/:priceAmount/:productName', async (req, res) => {
  try {
    const product = await stripe.products.create({
      name: req.params.productName,
      type: 'service'
    });
    const priceAmount = parseInt(req.params.priceAmount, 10);
    const price = await stripe.prices.create({
      unit_amount: priceAmount * 100,
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      product: product.id
    });
    const session = await stripe.checkout.sessions.create(
      {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: price.id,
            quantity: 1
          }
        ],

        success_url: 'http://localhost:3030',
        cancel_url: 'http://localhost:3030',
        customer: 'cus_P02l6C1LLVGNmW' //fixed customerID in stripe
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY
      }
    );

    return res.json(session);
  } catch (error) {
    console.error('Error creating checkout session,error');
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/session/oneTimePayment', async (req, res) => {
  try {
    const { products }: { products: Product[] } = req.body;
    console.log(req.body);

    // Create products in Stripe
    const stripeProducts = await Promise.all(
      products.map(async (product: Product) => {
        return await stripe.products.create({
          name: product.name,
          type: 'service'
        });
      })
    );

    const stripePrices = await Promise.all(
      products.map(async (product: Product, index: number) => {
        const productObj = stripeProducts[index];

        return await stripe.prices.create({
          unit_amount: product.price * 100, // assuming the price is in cents
          currency: 'usd',
          product: productObj.id
        });
      })
    );

    // Create line items for the Checkout Session
    const lineItems = stripePrices.map((price, index) => ({
      price: price.id,
      quantity: products[index].quantity
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: 'http://localhost:3030',
      cancel_url: 'http://localhost:3030'
    });

    return res.json(session);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/payment/checkout', (req: Request, res: Response) => {
  // Handle payment checkout logic here
  //   controller(res)()();
});

export default router;
