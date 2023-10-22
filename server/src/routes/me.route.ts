import express from 'express';

import { isAuthenticated, isAuthorized } from '../middlewares';

const router = express.Router();

// router.use(isAuthenticated);

// router.get('/info');

export default router;
