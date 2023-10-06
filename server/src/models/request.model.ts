import mongoose, { Date, Document, Schema } from 'mongoose';
interface ILicenses { 
    licenseID: string;
    licenseImage: string;
}
interface IRequest extends Document{
    doctorID: mongoose.Schema.Types.ObjectId;
    degree: string[];
    licenses: ILicenses[];
    status: 'Pending' | 'Approved' | 'Rejected';
    date: Date;
}

const requestSchema = new Schema<IRequest>({
    doctorID: { type: mongoose.Schema.Types.ObjectId , ref:'User', required: true },
    degree: { type: [String], required: true },
    licenses:
    {
        type: [
            {
                licenseID: { type: String, required: true },
                licenseImage: { type: String, required: true },
            },
        ], required: true
    },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], required: true },
    date: { type: Date, required: true },
});

const Request = mongoose.model<IRequest>('Request', requestSchema);

export default Request;

