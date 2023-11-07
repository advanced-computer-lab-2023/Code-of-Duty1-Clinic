import { User, ICommonUser, IContract, IRequest } from '.';
import mongoose, { Document, Schema } from 'mongoose';

const options = { discriminatorKey: 'role' };

interface DailySchedule {
  from: { hours: number; minutes: number };
  to: { hours: number; minutes: number };
}

interface IDoctor extends ICommonUser {
  profileImage?: string;
  isEmailVerified?: boolean;
  isContractAccepted: boolean;
  wallet?: number;
  hourRate: number;
  hospital: string;
  educationBackground: string;
  specialty: string;
  weeklySlots?: {
    Sunday: DailySchedule[];
    Monday: DailySchedule[];
    Tuesday: DailySchedule[];
    Wednesday: DailySchedule[];
    Thursday: DailySchedule[];
    Friday: DailySchedule[];
    Saturday: DailySchedule[];
  };
  vacations?: { from: Date; to: Date }[];

  contract?: IContract;
  request?: IRequest;
}

type IDoctorDocument = IDoctor & Document;

const dailyScheduleSchema = {
  from: {
    type: {
      hours: { type: Number, required: true, min: 0, max: 23 },
      minutes: { type: Number, required: false, default: 0, min: 0, max: 59 }
    },
    required: true
  },
  to: {
    type: {
      hours: { type: Number, required: true, min: 0, max: 23 },
      minutes: { type: Number, required: false, default: 0, min: 0, max: 59 }
    },
    required: true
  }
};

const doctorSchema = new Schema<IDoctorDocument>(
  {
    profileImage: String,
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isContractAccepted: {
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
    specialty: { type: String, required: true },
    weeklySlots: {
      type: {
        Sunday: [dailyScheduleSchema],
        Monday: [dailyScheduleSchema],
        Tuesday: [dailyScheduleSchema],
        Wednesday: [dailyScheduleSchema],
        Thursday: [dailyScheduleSchema],
        Friday: [dailyScheduleSchema],
        Saturday: [dailyScheduleSchema]
      },
      default: {}
    },
    vacations: { type: [{ from: { type: Date, required: true }, to: { type: Date, required: true } }], default: [] }
  },
  options
);

doctorSchema.virtual('request', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'medicID',
  justOne: false
});

doctorSchema.virtual('contract', {
  ref: 'Contract',
  localField: '_id',
  foreignField: 'doctorID'
});

const doctorModel: mongoose.Model<IDoctorDocument> = User.discriminator('Doctor', doctorSchema);

export default doctorModel<IDoctorDocument>;
export { IDoctor, DailySchedule };
