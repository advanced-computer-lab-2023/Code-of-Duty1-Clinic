import mongoose, { Document, Schema } from 'mongoose';

interface INotification {
  userID: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  type: 'Message' | 'Rescheduled' | 'Canceled' | 'Update';
  date: Date;
}

const notificationSchema = new Schema<INotification>({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['Message', 'Rescheduled', 'Canceled', 'Update'], required: true },
  date: { type: Date, required: true }
});

notificationSchema.index({ userID: 1 });

const NotificationModel = mongoose.model<INotification>('Notification', notificationSchema);

export default NotificationModel;
