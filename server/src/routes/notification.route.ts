import express from 'express';
import { deleteNotification, pushNotification, seeNotification, getNotifications } from '../services';
import controller from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';
import { SocketManager } from '../utils/socket-m';
import { NotificationManager } from '../utils/notification';

const router = express.Router();
router.use(isAuthenticated);

router.get('/:userID', async (req, res) => {
  //    await NotificationManager.notify(req.decoded.id, 'Message', "A message was sent", "Nessagw f");
  controller(res)(getNotifications)(req.decoded.id);
});
export default router;
