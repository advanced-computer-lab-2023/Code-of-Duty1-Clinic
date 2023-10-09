// import express, { Request, Response } from 'express';
// // import session from 'express-session';
// import { json, urlencoded } from 'body-parser';
// import logger from 'morgan';
// import helmet from 'helmet';
// import compression from 'compression';
// import { queryParser } from './middlewares';

// const app = express();

// app.use(queryParser());
// app.use(urlencoded({ extended: false }));
// app.use(logger('dev'));
// app.use(helmet());
// app.use(compression());
// // app.use(
// //   session({
// //     secret: 'superSecret',
// //     resave: false,
// //     saveUninitialized: false,
// //     cookie: {
// //       sameSite: true,
// //       secure: false
// //     }
// //   })
// // );
// app.use(queryParser);

// app.use('/auth',loginroute);
// app.use('/users');
// app.use('/products');
// app.use('/reviews');
// app.use('/cart');
// app.use('/orders');

// app.all('*', (req: Request, res: Response) => res.status(404).send('NOT FOUND'));

// export default app;
