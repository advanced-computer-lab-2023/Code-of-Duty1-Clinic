import mongoose, { Document, Schema } from 'mongoose';

interface IPrescription {
  doctorID: mongoose.Types.ObjectId;
  patientID: mongoose.Types.ObjectId;
  description: string;
  isFilled?: boolean;
  dateIssued?: Date;
  isSubmitted?: boolean;
  medicines?: {
    medicine: string;
    dosage: string;
  }[];
}

type IPrescriptionDocument = IPrescription & Document;

const prescriptionSchema = new Schema<IPrescriptionDocument>({
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
  medicines: {
    type: [
      {
        medicine: { type: String, required: true },
        dosage: { type: String, required: true }
      }
    ],
    default: []
  },
  description: { type: String, required: true },
  isFilled: { type: Boolean, default: false },
  isSubmitted: { type: Boolean, default: false },
  dateIssued: { type: Date, default: Date.now() }
});

prescriptionSchema.index({ doctorID: 1 });
prescriptionSchema.index({ patientID: 1 });

const PrescriptionModel = mongoose.model<IPrescriptionDocument>('Prescription', prescriptionSchema);

export default PrescriptionModel;
export { IPrescription };
