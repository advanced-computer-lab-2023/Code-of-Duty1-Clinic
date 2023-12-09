import { User, ICommonUser, IRequest } from '.';
import mongoose, { Document, Schema } from 'mongoose';

const options = { discriminatorKey: 'role' };

interface IPharmacist extends ICommonUser {
  vacations: { from: Date; to: Date }[];
  profileImage?: string;
  isEmailVerified?: boolean;
  isAccepted?: boolean;
  wallet?: number;
  hourRate: number;
  hospital: string;
  educationBackground: string;
  specialty?: string;

  request?: IRequest;
}

type IPharmacistDocument = IPharmacist & Document;

const pharmacistSchema = new Schema(
  {
    profileImage: String,
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isAccepted: {
      type: Boolean,
      default: false
    },
    wallet: {
      type: Number,
      default: 0
    },
    hourRate: { type: Number, required: true },
    hospital: { type: String, required: true },
    educationBackground: { type: String, required: true },
    specialty: { type: String }
  },
  options
);

pharmacistSchema.virtual('request', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'medicID',
  justOne: false
});

const pharmacistModel: mongoose.Model<IPharmacistDocument> = User.discriminator('Pharmacist', pharmacistSchema);

export default pharmacistModel;
export { IPharmacist };
