import mongoose, { Document, Schema } from 'mongoose';

interface IPackage extends Document {
  name: string;
  price: number;
  sessionDiscount: number;
  medicineDiscount: number;
  familyDiscount: number;
  isLatest: boolean;
}

const packageSchema = new Schema<IPackage>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sessionDiscount: { type: Number, required: true },
  medicineDiscount: { type: Number, required: true },
  familyDiscount: { type: Number, required: true },
  isLatest: { type: Boolean, required: true }
});

const PackageModel = mongoose.model<IPackage>('Package', packageSchema);

export default PackageModel;
