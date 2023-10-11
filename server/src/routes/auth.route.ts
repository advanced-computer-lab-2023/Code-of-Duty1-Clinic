import express from 'express';
const router = express.Router();

const controller = require("../controllers/controller");

const authService = require('../services/auth service')

const {register,login} = authService;

//const {isAuthenticated} = require('../middlewares')

router.post('/registerPatient',(req,res)=>controller(res)(register)(req.body));
router.post('/registerDoctor',(req,res)=>controller(res)(register)(req.body));
router.post('/login',(req,res)=>controller(res, req.session)(login)((token = req.session.token), req.body));

module.exports = router;
