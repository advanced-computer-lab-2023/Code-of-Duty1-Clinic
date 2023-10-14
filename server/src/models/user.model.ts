import bcrypt from 'bcryptjs';
import validator from 'validator';
import mongoose, { Document, Schema } from 'mongoose';
import Contract from '../models/contract.model';

interface FamilyMemberWithID {
  userID: mongoose.Types.ObjectId;
  nationalID: string;
  relation: 'Husband' | 'Wife' | 'Child';
}

interface FamilyMemberWithDetails {
  name: string;
  nationalID: string;
  phone: string;
  birthDate: Date;
  gender: 'Male' | 'Female';
  relation: 'Husband' | 'Wife' | 'Child';
}

type FamilyMember = FamilyMemberWithID | FamilyMemberWithDetails;
interface DailySchedule {
  from: { hours: number; minutes: number };
  to: { hours: number; minutes: number };
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
    profileImage: String,
    isEmailVerified: { type: Boolean, default: false },
    wallet: { type: Number, default: 0 },

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
          birthDate: Date,
          gender: { type: String, enum: ['Male', 'Female'] },
          relation: {
            type: String,
            enum: ['Husband', 'Wife', 'Child'],
            required: true
          }
        }
      ],
      validate: {
        validator: function (arr: FamilyMember[]) {
          const nationalIDs: string[] = [];

          for (const elem of arr) {
            if (nationalIDs.includes(elem.nationalID)) {
              return false; // National ID is not unique
            }

            nationalIDs.push(elem.nationalID);
          }

          return true;
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
      }
    },
    vacations: {
      type: [{ from: Date, to: Date }]
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
  foreignField: 'doctorID'
});

userSchema.pre<IUserDocument>('save', function (next) {
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
export { IUser, IUserDocument, IPatient, IDoctor, ICommonUser, DailySchedule };
