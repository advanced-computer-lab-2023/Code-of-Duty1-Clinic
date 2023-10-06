import mongoose, { Document, Schema } from 'mongoose';

interface IContract  extends Document{
  doctorID: mongoose.Schema.Types.ObjectId;
  start: Date;
  state: 'Rejected' | 'Accepted' | 'Pending';
  end: Date;
  markUpProfit: number;
}

const contractSchema = new Schema<IContract>({
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    start: { type: Date, required: true },
  state: { type: String, enum: ['Rejected','Accepted','Pending'], required: true },
    end: { type: Date, required: true },
    markUpProfit: { type: Number, required: true },
});
contractSchema.index({ doctorID: 1 });
const ContractModel = mongoose.model<IContract>('Contract', contractSchema);

export default ContractModel;
