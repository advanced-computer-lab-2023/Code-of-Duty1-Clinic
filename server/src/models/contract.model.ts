import mongoose, { Document, Schema } from 'mongoose';

interface IContract {
  doctorID: mongoose.Schema.Types.ObjectId;
  startDate: Date;
  status?: 'Rejected' | 'Accepted' | 'Pending';
  endDate: Date;
  markUpProfit: number;
}

type IContractDocument = IContract & Document;

const contractSchema = new Schema<IContractDocument>({
  doctorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Rejected', 'Accepted', 'Pending'], default: 'Pending' },
  markUpProfit: { type: Number, required: true, min: 0, max: 100 }
});

contractSchema.index({ doctorID: 1 });

const ContractModel = mongoose.model<IContractDocument>('Contract', contractSchema);

export default ContractModel;
export { IContract };
