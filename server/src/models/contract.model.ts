import mongoose, { Document, Schema } from 'mongoose';

interface Contract {
  doctorID: mongoose.Schema.Types.ObjectId;
  start: Date;
  state: string;
  end: Date;
  markUpProfit: number;
}

const contractSchema = new Schema<Contract & Document>({
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    start: { type: Date, required: true },
    state: { type: String, required: true },
    end: { type: Date, required: true },
    markUpProfit: { type: Number, required: true },
});

const ContractModel = mongoose.model<Contract & Document>('Contract', contractSchema);

export default ContractModel;
