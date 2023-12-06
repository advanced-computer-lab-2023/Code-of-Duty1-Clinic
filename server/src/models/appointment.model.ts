import mongoose, { Document, Schema } from 'mongoose';

interface IAppointment {
  doctorID: mongoose.Schema.Types.ObjectId;
  patientID: mongoose.Schema.Types.ObjectId;
  patientName: String;
  status?: 'Upcoming' | 'Completed' | 'Cancelled' | 'Rescheduled';
  sessionPrice: number;
  startDate: Date;
  endDate: Date;
  isFollowUp?: boolean;
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
  patientName: {
    type: String,
    required: true
  },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled', 'Rescheduled'], default: 'Upcoming' },
  sessionPrice: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isFollowUp: { type: Boolean, default: false },
  previousAppointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: false }
});

appointmentSchema.index({ doctorID: 1 });
appointmentSchema.index({ patientID: 1 });

const AppointmentModel = mongoose.model<IAppointmentDocument>('Appointment', appointmentSchema);

export default AppointmentModel;
export { IAppointment };
