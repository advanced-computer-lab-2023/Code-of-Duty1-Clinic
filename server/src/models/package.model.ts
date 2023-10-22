import mongoose, { Document, Schema } from 'mongoose';

interface IPackage {
  name: string;
  price: number;
  sessionDiscount: number;
  medicineDiscount: number;
  familyDiscount: number;
  isLatest?: boolean;
}
type IPackageDocument = IPackage & Document;
const packageSchema = new Schema<IPackageDocument>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sessionDiscount: { type: Number, required: true, min: 0, max: 100 },
  medicineDiscount: { type: Number, required: true, min: 0, max: 100 },
  familyDiscount: { type: Number, required: true, min: 0, max: 100 },
  isLatest: { type: Boolean, default: true }
});

const PackageModel = mongoose.model<IPackageDocument>('Package', packageSchema);

export default PackageModel;
export { IPackage };
