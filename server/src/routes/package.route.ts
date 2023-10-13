import express from 'express';
import controller from '../controllers/controller';
import { isAuthorized } from '../middlewares';
import { addPackage, updatePackage, deletePackage } from '../services/package/package.service';
const router = express.Router();
// http methods required for this router

// router.use(isAuthorized("Administrator"));
// router.get('/', (req, res) => {
//   controller(res)(getPackages)(req.query);
// });

router.post('/', (req, res) => {
  controller(res)(addPackage)(req.body);
});
router.put('/:id', (req, res) => {
  console.log('tell me if i go there or nots');
  controller(res)(updatePackage)(req.params.id, req.body);
});
router.delete('/:id', (req, res) => {
  controller(res)(deletePackage)(req.params.id);
});

//

export default router;
