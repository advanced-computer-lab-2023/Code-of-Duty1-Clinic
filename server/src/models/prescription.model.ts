import mongoose, { Document, Schema } from 'mongoose';

interface MedicineDosage {
  medicine: string;
  dosage: string; // what is a dosage is it a number 
}

interface IPrescription extends Document {
  doctorID: mongoose.Types.ObjectId;
  patientID: mongoose.Types.ObjectId;
  medicines: MedicineDosage[];
  description: string;
  isFilled: boolean;
  dateIssued: Date;
  isSubmitted: boolean;
}

const prescriptionSchema = new Schema<IPrescription>({
 doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    medicines: {
        type: [
            {
                medicine: { type: String, required: true },
                dosage: { type: String, required: true },
            },
        ],
        required: true,
    },
    description: { type: String, required: true },
    isFilled: { type: Boolean, required: true },
    dateIssued: { type: Date, required: true },
    isSubmitted: { type: Boolean, required: true },
    
});
prescriptionSchema.index({ doctorID: 1 });
prescriptionSchema.index({ patientID: 1 });
const PrescriptionModel = mongoose.model<IPrescription>('Prescription', prescriptionSchema);

export default PrescriptionModel;
