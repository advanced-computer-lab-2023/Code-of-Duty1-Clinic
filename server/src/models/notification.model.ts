import mongoose, { Document, Schema } from 'mongoose';

interface INotification {
  userID: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  type: 'Message' | 'Rescheduled' | 'Canceled' | 'Update';
  date?: Date;
  isSeen: boolean;
}

const notificationSchema = new Schema<INotification>({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['Message', 'Rescheduled', 'Canceled', 'Update','Appointment'], required: true, default: 'Update' },
  date: { type: Date, default: Date.now() },
  isSeen: { type: Boolean, default: false }
});

notificationSchema.index({ userID: 1 });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
export { INotification };
