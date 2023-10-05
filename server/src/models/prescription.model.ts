import mongoose, { Document, Schema } from 'mongoose';

interface MedicineDosage {
  medicine: string;
  dosage: string; // what is a dosage is it a number 
}

interface Prescription {
  doctorID: mongoose.Types.ObjectId;
  patientID: mongoose.Types.ObjectId;
  medicines: MedicineDosage[];
  description: string;
  isFilled: boolean;
  dateIssued: Date;
  isSubmitted: boolean;
}

const prescriptionSchema = new Schema<Prescription & Document>({
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

const PrescriptionModel = mongoose.model<Prescription & Document>('Prescription', prescriptionSchema);

export default PrescriptionModel;
