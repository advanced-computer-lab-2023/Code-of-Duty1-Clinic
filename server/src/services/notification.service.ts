import { Notification } from '../models';
import { NotificationManager } from '../utils/notification';

const pushNotification = async (info: object) => {
  console.log('NDFF', info);
  const newNotification = new Notification(info);

  return await newNotification.save();
};
const getNotifications = async (userID: string) => {
  try {
    const notification = await Notification.find({ userID: userID });
    // console.log(notification, "*--*--*", userID);
    return notification;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

const seeNotification = async (filter: object) => {
  console.log(JSON.stringify(filter), ' 7887 f f');
  return await Notification.updateOne(filter, { isSeen: true }, { new: true });
};
const deleteNotification = async (notificationId: string) => {
  return await Notification.deleteOne({ _id: notificationId });
};

export { pushNotification, getNotifications, seeNotification, deleteNotification };
