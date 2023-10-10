import mongoose, { Document, Schema } from 'mongoose';

interface IPackage {
  name: string;
  price: number;
  sessionDiscount: number;
  medicineDiscount: number;
  familyDiscount: number;
  isLatest: boolean;
}
type IPackageDocument = IPackage & Document;
const packageSchema = new Schema<IPackageDocument>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sessionDiscount: { type: Number, required: true },
  medicineDiscount: { type: Number, required: true },
  familyDiscount: { type: Number, required: true },
  isLatest: { type: Boolean, required: true }
});

const PackageModel = mongoose.model<IPackageDocument>('Package', packageSchema);

export default PackageModel;
export { IPackage, IPackageDocument };
