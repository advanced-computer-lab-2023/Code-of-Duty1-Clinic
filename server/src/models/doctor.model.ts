import userModel, { ICommonUser } from './user';
import mongoose, { Document, Schema } from 'mongoose';
const options = { discriminatorKey: 'role' };

const dailyScheduleSchema = new mongoose.Schema({
  from: {
    hours: { type: Number, required: true, min: 0, max: 23 },
    minutes: { type: Number, required: false, default: 0, min: 0, max: 59 }
  },
  to: {
    hours: { type: Number, required: true, min: 0, max: 23 },
    minutes: { type: Number, required: false, default: 0, min: 0, max: 59 }
  },
  maxPatients: {
    type: Number,
    required: true
  }
});
interface DailySchedule {
  from: { hours: number; minutes: number };
  to: { hours: number; minutes: number };
  maxPatients: number;
}
interface IDoctor extends ICommonUser {
  hourRate: number;
  hospital: string;
  educationBackground: string;
  specialty: string;
  weeklySlots: {
    Sunday: DailySchedule[];
    Monday: DailySchedule[];
    Tuesday: DailySchedule[];
    Wednesday: DailySchedule[];
    Thursday: DailySchedule[];
    Friday: DailySchedule[];
    Saturday: DailySchedule[];
  };
  vacations: { from: Date; to: Date }[];
}

type IDoctorDocument = IDoctor & Document;

const doctorSchema = new Schema<IDoctorDocument>(
  {
    hourRate: { type: Number, required: true },
    hospital: { type: String, required: true },
    educationBackground: { type: String, required: true },
    specialty: { type: String, required: true },
    weeklySlots: {
      Sunday: [dailyScheduleSchema],
      Monday: [dailyScheduleSchema],
      Tuesday: [dailyScheduleSchema],
      Wednesday: [dailyScheduleSchema],
      Thursday: [dailyScheduleSchema],
      Friday: [dailyScheduleSchema],
      Saturday: [dailyScheduleSchema]
    },
    vacations: [{ from: Date, to: Date }]
  },
  options
);

const doctorModel: mongoose.Model<IDoctorDocument> = userModel.discriminator('Doctor', doctorSchema);

export default doctorModel<IDoctorDocument>;
