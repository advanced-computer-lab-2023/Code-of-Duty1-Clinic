import mongoose, { Date, Document, Schema } from 'mongoose';
interface ILicenses {
  licenseID: string;
  licenseImage: string;
}
interface IRequest {
  medicID: mongoose.Schema.Types.ObjectId;
  ID: String;
  degree: string[];
  licenses: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  date: Date;
}
type IRequestDocument = IRequest & Document;
const requestSchema = new Schema<IRequestDocument>({
  medicID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ID: { type: String },
  degree: { type: [String], required: true },
  licenses: { type: [String], required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], required: true },
  date: { type: Date, default: Date.now(), required: true }
});

const Request = mongoose.model<IRequestDocument>('Request', requestSchema);

export default Request;
