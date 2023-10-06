import express from'express'; 
const router =  express.Router();
// http methods required for this router

import { register, login, logout, changePassword } from '../controllers/auth.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { controller } from '../middlewares/controller.middleware';

router.post('/register', (req, res) => controller(res)(register)(req.body));

router.post('/login', (req, res) =>
  controller(res, req.session)(login)((token = req.session.token), req.body)
);

router.use(isAuthenticated);

router.post('/logout', (req, res) => controller(res)(logout)(req.session));

router.put('/change-password', (req, res) =>
  controller(res)(changePassword)(req.session.user.id, req.body)
);




module.exports = router; 
