import express, { Request, Response } from 'express';
import { login, logout, register, changePassword } from '../services/auth';
import controller from '../controllers/controller';
const UserRouter = express.Router();

module.exports = UserRouter;
