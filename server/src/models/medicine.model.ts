import mongoose, { Document, Schema } from 'mongoose';

interface IMedicine extends Document {
  name: string;
  description: string;
  price: number;
  numStock: number;
  numSold?: number;
  medicalUse: string;
  activeIngredients: string[];
  isArchived?: boolean;
  isOverTheCounter: boolean;
  image?: string;
}

const medicineSchema = new Schema<IMedicine>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  numStock: {
    type: Number,
    required: true
  },
  numSold: {
    type: Number,
    default: 0
  },
  medicalUse: {
    type: String,
    required: true
  },
  activeIngredients: {
    type: [String],
    default: []
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isOverTheCounter: {
    type: Boolean,
    required: true
  },
  image: {
    type: String
  }
});

const Medicine = mongoose.model<IMedicine>('Medicine', medicineSchema);

export default Medicine;
export { IMedicine };
