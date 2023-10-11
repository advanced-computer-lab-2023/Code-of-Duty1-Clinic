import mongoose, { Document, Schema } from 'mongoose';

interface IAppointment {
  doctorID: mongoose.Schema.Types.ObjectId;
  patientID: mongoose.Schema.Types.ObjectId;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Rescheduled';
  sessionPrice: number;
  startTime: Date;
  endTime: Date;
  isFollowUp: boolean;
  previousAppointment?: mongoose.Schema.Types.ObjectId;
}
type IAppointmentDocument = IAppointment & Document;
const appointmentSchema = new Schema<IAppointmentDocument>({
  doctorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled', 'Rescheduled'], required: true },
  sessionPrice: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isFollowUp: { type: Boolean, required: true },
  previousAppointment: { type: mongoose.Schema.Types.ObjectId, required: false }
});
appointmentSchema.index({ doctorID: 1 });
appointmentSchema.index({ patientID: 1 });

const AppointmentModel = mongoose.model<IAppointmentDocument>('Appointment', appointmentSchema);

export default AppointmentModel;
