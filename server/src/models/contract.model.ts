import mongoose, { Document, Schema } from 'mongoose';

interface IContract {
  doctorID: mongoose.Schema.Types.ObjectId;
  start: Date;
  state: 'Rejected' | 'Accepted' | 'Pending';
  end: Date;
  markUpProfit: number;
}
type IContractDocument = IContract & Document;
const contractSchema = new Schema<IContractDocument>({
  doctorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  start: { type: Date, required: true },
  state: { type: String, enum: ['Rejected', 'Accepted', 'Pending'], required: true },
  end: { type: Date, required: true },
  markUpProfit: { type: Number, required: true }
});
contractSchema.index({ doctorID: 1 });
const ContractModel = mongoose.model<IContractDocument>('Contract', contractSchema);

export default ContractModel;
