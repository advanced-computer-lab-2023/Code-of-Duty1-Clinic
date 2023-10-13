import express from 'express';
import controller from '../controllers/controller';
import { isAuthorized } from '../middlewares';
import { addPackage, updatePackage, deletePackage } from '../services/package.service';
const packageRouter = express.Router();

// router.use(isAuthorized("Administrator"));
packageRouter.post('/', (req, res) => {
  controller(res)(addPackage)(req.body);
});
packageRouter.put('/:id', (req, res) => {
  console.log('tell me if i go there or nots');
  controller(res)(updatePackage)(req.params.id, req.body);
});
packageRouter.delete('/:id', (req, res) => {
  controller(res)(deletePackage)(req.params.id);
});

//

export default packageRouter;
