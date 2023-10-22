import mongoose, { Date, Document, Schema } from 'mongoose';

interface IRequest {
  medicID: mongoose.Schema.Types.ObjectId;
  ID?: string;
  degree?: string[];
  licenses?: string[];
  status?: 'Pending' | 'Approved' | 'Rejected';
  date?: Date;
}

type IRequestDocument = IRequest & Document;

const requestSchema = new Schema<IRequestDocument>({
  medicID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ID: { type: String },
  degree: { type: [String], default: [] },
  licenses: { type: [String], default: [] },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  date: { type: Date, default: Date.now() }
});

const Request = mongoose.model<IRequestDocument>('Request', requestSchema);

export default Request;
export { IRequest };
