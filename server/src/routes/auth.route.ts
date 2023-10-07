import express from "express";
const router = express.Router();
// http methods required for this router

<<<<<<< HEAD
import {
  register,
  login,
  logout,
  changePassword,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { controller } from "../controllers/index";

router.post("/register", (req, res) => controller(res)(register)(req.body));

router.post("/login", (req, res) =>
  controller(res, req.session)(login)((token = req.session.token), req.body)
);

router.use(isAuthenticated);

router.post("/logout", (req, res) => controller(res)(logout)(req.session));

router.put("/change-password", (req, res) =>
  controller(res)(changePassword)(req.session.user.id, req.body)
);

module.exports = router;
=======



module.exports = router; 
>>>>>>> 91117dbd5776fdc25c3d25a9984edc8ba75471ab
