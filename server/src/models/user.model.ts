import mongoose, { Date, Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

interface EmergencyContact {
  name: string;
  phone: string;
  relation: 'Husband' | 'Wife' | 'Child';
}

// interface FamilyMember {
//   // Case 1: Family member with userId and relation
//   userId?: mongoose.Types.ObjectId;
//   relation: 'Husband' | 'Wife' | 'Child';

//   // Case 2: Family member with personal details
// } | {
//   name?: string;
//   nationalID?: string;
//   phone?: string;
// }

interface FamilyMemberWithRelation {
  userId?: mongoose.Types.ObjectId;
  relation: 'Husband' | 'Wife' | 'Child';
  type: 'WithRelation'; // Discriminator property
}

interface FamilyMemberWithDetails {
  name?: string;
  nationalID?: string;
  phone?: string;
  type: 'WithDetails'; // Discriminator property
}

type FamilyMember = FamilyMemberWithRelation | FamilyMemberWithDetails;

interface MedicalHistory {
  name: string;
  medicalRecord: string;
}

interface Prescription {
  medicine: string;
  dosage: string;
}

interface IUser extends Document {
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
  address: string[];
  role: 'Patient' | 'Doctor' | 'Administrator';
  profileImage: string;
  isEmailVerified: boolean;
  wallet: number;
  emergencyContact?: EmergencyContact;
  family?: FamilyMember[];
  prescriptions?: Prescription[];
  medicalHistory?: MedicalHistory[];
  package?: {
    packageID: mongoose.Schema.Types.ObjectId;
    packageStatus: 'subscribed with renewal date' | 'unsubscribed' | 'cancelled with end date';
    endDate: Date;
  };

  hourRate?: number;
  hospital?: string;
  educationBackground?: string;
  specialization?: string;
  medicalDegree?: string;
  medicalLicenses?: {
    licenseID: string;
    licenseImage: string;
  }[];
  acceptedContractId?: mongoose.Schema.Types.ObjectId;
  sessionTime?: Number;
  availableSlots?: {
    day: string;
    slots: number[];
  }[];

  doctorRequestStatus?: 'Pending' | 'Accepted' | 'Rejected';
}

const userSchema = new Schema<IUser>({
  name: {
    first: { type: String, required: true },
    middle: { type: String, required: false },
    last: { type: String, required: true }
  },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  phone: { type: String, required: true },
  address: { type: [String], required: false },
  role: { type: String, enum: ['Patient', 'Doctor', 'Administrator'], required: true },
  profileImage: { type: String, required: true },
  isEmailVerified: { type: Boolean, required: true },
  wallet: { type: Number, required: true },
  emergencyContact: {
    type: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relation: { type: String, enum: ['Husband', 'Wife', 'Child'], required: true }
    },
    required: function () {
      return this.role === 'Patient';
    }
  },
  family: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, required: false },
        name: { type: String, required: false },
        nationalID: { type: String, required: false },
        phone: { type: String, required: false },
        relation: { type: String, enum: ['Husband', 'Wife', 'Child'], required: true }
      }
    ],
    required: function () {
      return this.role === 'Patient';
    },
    validate: {
      //TODO
      validator: function (arr: FamilyMember[]) {
        const hasWithRelation = arr.some((member) => member.type === 'WithRelation');
        const hasWithDetails = arr.some((member) => member.type === 'WithDetails');
        return hasWithRelation !== hasWithDetails;
      },
      message: 'Either name, nationalID, and phone should be provided, or userId and relation should be provided.'
    }
  },
  medicalHistory: {
    type: [
      {
        name: { type: String, required: true, unique: true },
        medicalRecord: { type: String, required: true }
      }
    ],
    required: function () {
      return this.role === 'Patient';
    }
  },
  package: {
    type: {
      packageID: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
      packageStatus: {
        type: String,
        enum: ['subscribed with renewal date', 'unsubscribed', 'cancelled'],
        required: true
      },
      endDate: { type: Date, required: true }
    },
    required: false,
    default: {}
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
  specialization: {
    type: String,
    required: function () {
      return this.role === 'Doctor';
    }
  },
  //     acceptedContractId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Contract',
  //     required: function (this: { role?: string }) {
  //         return this.role === 'Doctor';
  //     }// TODO do we need this here?
  // },

  sessionTime: {
    type: Number,
    required: function () {
      return this.role === 'Doctor';
    }
  },
  availableSlots: {
    type: [
      {
        day: { type: String, required: true },
        slots: { type: [Number], required: true }
      }
    ],
    required: function () {
      return this.role === 'Doctor';
    }
  }
});
userSchema.pre<IUser>('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
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
const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;
