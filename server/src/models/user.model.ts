import bcrypt from 'bcryptjs';
import validator from 'validator';
import mongoose, { Document, Schema } from 'mongoose';

interface FamilyMemberWithID {
  userID: mongoose.Types.ObjectId;
  relation: 'Husband' | 'Wife' | 'Child';
}

interface FamilyMemberWithDetails {
  name: string;
  nationalID: string;
  phone: string;
  relation: 'Husband' | 'Wife' | 'Child';
}

type FamilyMember = FamilyMemberWithID | FamilyMemberWithDetails;
interface DailySchedule {
  from: number;
  to: number;
  maxPatients: number;
}

interface ICommonUser {
  name: {
    first: string;
    middle: string;
    last: string;
  };
  username: string;
  email: string;
  password: string;
  birthDate: Date;
  gender: 'Male' | 'Female';
  phone: string;
  addresses: string[];
  role: 'Patient' | 'Doctor' | 'Administrator';
  profileImage: string;
  isEmailVerified: boolean;
  wallet: number;
  isCorrectPassword(password: string): Promise<boolean>;
}
interface IEmergencyContact {
  name: string;
  phone: string;
  relation: 'Husband' | 'Wife' | 'Child';
}

interface IPatient extends ICommonUser {
  family: FamilyMember[];
  emergencyContact: IEmergencyContact[];
  medicalHistory: {
    name: string;
    medicalRecord: string;
  }[];
  package?: {
    packageID: mongoose.Types.ObjectId;
    packageStatus?: 'Subscribed' | 'Unsubscribed' | 'Cancelled';
    endDate: Date;
  };
}

interface IDoctor extends ICommonUser {
  hourRate: number;
  hospital: string;
  educationBackground: string;
  specialty: string;
  weeklySlots: {
    Sunday?: DailySchedule[];
    Monday?: DailySchedule[];
    Tuesday?: DailySchedule[];
    Wednesday?: DailySchedule[];
    Thursday?: DailySchedule[];
    Friday?: DailySchedule[];
    Saturday?: DailySchedule[];
  };
  vacations: { from: Date; to: Date }[];
}

type IUser = ICommonUser | IPatient | IDoctor;
type IUserDocument = IUser & Document;
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

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      first: { type: String, required: true },
      middle: String,
      last: { type: String, required: true }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value: string) {
        return validator.isEmail(value);
      }
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    phone: { type: String, required: true },
    addresses: { type: [String], required: false },
    role: {
      type: String,
      enum: ['Patient', 'Doctor', 'Administrator'],
      required: true
    },
    profileImage: { type: String, required: true },
    isEmailVerified: { type: Boolean, required: true },
    wallet: { type: Number, required: true },

    emergencyContact: {
      type: [
        {
          name: { type: String, required: true },
          phone: { type: String, required: true },
          relation: { type: String, enum: ['Husband', 'Wife', 'Child'], required: true }
        }
      ],
      required: function () {
        return this.role === 'Patient';
      }
    },
    family: {
      type: [
        {
          userID: mongoose.Schema.Types.ObjectId,
          name: String,
          nationalID: String,
          phone: String,
          relation: {
            type: String,
            enum: ['Husband', 'Wife', 'Child'],
            required: true
          }
        }
      ],
      validate: {
        //TODO
        validator: function (arr: any) {
          try {
            arr.forEach((elem: any) => {
              elem as FamilyMember;
            });
            return true;
          } catch (e) {
            return false;
          }
        },
        message: 'Either name, nationalID, and phone should be provided, or userID and relation should be provided.'
      }
    },
    medicalHistory: {
      type: [
        {
          name: { type: String, required: true },
          medicalRecord: { type: String, required: true }
        }
      ]
    },
    package: {
      type: {
        packageID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Package',
          required: true
        },
        packageStatus: {
          type: String,
          enum: ['subscribed', 'unsubscribed', 'cancelled'],
          required: true
        },
        endDate: { type: Date, required: true }
      }
    },

    hourRate: {
      type: Number,
      required: function () {
        return this.role === 'Doctor';
      }
    },
    hospital: {
      type: String,
      required: function () {
        return this.role === 'Doctor';
      }
    },
    specialty: {
      type: String,
      required: function () {
        return this.role === 'Doctor';
      }
    },
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
      required: function () {
        return this.role === 'Doctor';
      }
    },
    vacations: {
      type: [{ from: Date, to: Date }],
      required: function () {
        return this.role === 'Doctor';
      }
    }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

userSchema.virtual('requestID', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'medicID',
  justOne: false
});

userSchema.virtual('contractID', {
  ref: 'Contract',
  localField: '_id',
  foreignField: 'doctorID',
  justOne: false
});

userSchema.pre<IUserDocument>('save', function (next) {
  console.log('bghnjmnbnhjbthnbtvbhnvgbhbyvfgdcuneyud877847477');
  if (!this.isModified('password')) return next();

  const Rounds = 10;
  const salt = bcrypt.genSaltSync(Rounds);
  const hashedPassword = bcrypt.hashSync(this.password, salt);

  this.password = hashedPassword;
  next();
});

userSchema.methods.isCorrectPassword = function (enteredPassword: string): boolean {
  return bcrypt.compareSync(enteredPassword, this.password);
};

// userSchema.index({ _id: 1 });
// mongo automatically creates index on _id and unique fields
// https://docs.mongodb.com/manual/indexes/#default-id-index

const UserModel = mongoose.model<IUserDocument>('User', userSchema);

export default UserModel;
export { FamilyMember, IEmergencyContact };
export { IUser, IUserDocument, IPatient, IDoctor, ICommonUser };
