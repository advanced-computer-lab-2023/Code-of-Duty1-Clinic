import mongoose, { Document, Schema } from 'mongoose';

interface Package {
  name: string;
  price: number;
  sessionDiscount: number;
  medicineDiscount: number;
  familyDiscount: number;
  isLatest: boolean;
  lastSubscribedUserEndDate?: Date;
}

const packageSchema = new Schema<Package & Document>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    sessionDiscount: { type: Number, required: true },
    medicineDiscount: { type: Number, required: true },
    familyDiscount: { type: Number, required: true },
    isLatest: { type: Boolean, required: true },
    lastSubscribedUserEndDate: { type: Date, required: false },
});

const PackageModel = mongoose.model<Package & Document>('Package', packageSchema);

export default PackageModel;
