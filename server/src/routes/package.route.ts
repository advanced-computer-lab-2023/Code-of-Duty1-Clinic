import express from 'express';
import controller from '../controllers/controller';
import { isAuthenticated, isAuthorized } from '../middlewares';
import { getPackages, addPackage, updatePackage, deletePackage } from '../services/package.service';
const router = express.Router();

// packageRouter.use(isAuthenticated)
// packageRouter.use(isAuthorized("Admin"));

router.get('/', (req, res) => {
  controller(res)(getPackages)(req.query);
});

router.post('/', (req, res) => {
  controller(res)(addPackage)(req.body);
});

router.put('/:id', (req, res) => {
  controller(res)(updatePackage)(req.params.id, req.body);
});

router.delete('/:id', (req, res) => {
  controller(res)(deletePackage)(req.params.id);
});

export default router;
