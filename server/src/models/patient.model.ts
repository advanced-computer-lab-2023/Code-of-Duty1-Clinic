import User, { ICommonUser } from './user.model';
import mongoose, { Schema, Document } from 'mongoose';

const options = { discriminatorKey: 'role' };

interface FamilyMemberWithID {
  userID: mongoose.Types.ObjectId;
  relation: 'Husband' | 'Wife' | 'Child';
}

interface FamilyMemberWithDetails {
  name: string;
  nationalID: string;
  age: number;
  gender: 'Male' | 'Female';
  relation: 'Husband' | 'Wife' | 'Child';
}

type FamilyMember = FamilyMemberWithID | FamilyMemberWithDetails;

interface IPatient extends ICommonUser {
  addresses?: string[];
  profileImage?: string;
  isEmailVerified?: boolean;
  wallet?: number;
  family?: FamilyMember[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: 'Husband' | 'Wife' | 'Child';
  };
  medicalHistory?: {
    name: string;
    medicalRecord: string;
  }[];
  package?: {
    packageID: mongoose.Types.ObjectId;
    packageStatus?: 'Subscribed' | 'Unsubscribed' | 'Cancelled';
    endDate: Date;
  };
}

type IPatientDocument = IPatient & Document;

const patientSchema = new Schema(
  {
    addresses: [String],
    profileImage: String,
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    wallet: {
      type: Number,
      default: 0
    },
    emergencyContact: {
      type: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        relation: { type: String, enum: ['Husband', 'Wife', 'Child'], required: true }
      }
    },
    family: {
      type: [
        {
          userID: { type: mongoose.Types.ObjectId, ref: 'User' },
          name: String,
          nationalID: { type: String },
          age: Number,
          gender: { type: String, enum: ['Male', 'Female'] },
          relation: {
            type: String,
            enum: ['Husband', 'Wife', 'Child'],
            required: true
          }
        }
      ],
      default: [],
      validate: {
        validator: function (arr: any[]) {
          for (const member of arr) {
            const { relation, userID, name, nationalID, age, gender } = member;

            if (!relation) return false;
            if (!userID && !(name && nationalID && age && gender)) return false;
          }

          return true;
        },
        message:
          'Either name, nationalID, age and gender, relation should be provided, or userID and relation should be provided.'
      }
    },
    medicalHistory: {
      type: [
        {
          name: { type: String, required: true },
          medicalRecord: { type: String, required: true }
        }
      ],
      default: []
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
          enum: ['Subscribed', 'Unsubscribed', 'Cancelled'],
          required: true
        },
        endDate: { type: Date, required: true }
      }
    }
  },
  options
);

const patientModel: mongoose.Model<IPatientDocument> = User.discriminator('Patient', patientSchema);

<<<<<<< HEAD
// patientModel.collection.indexExists('family.userID_1').then((exists) => {
//   if (exists) patientModel.collection.dropIndex('family.userID_1').then();
// });
// patientModel.collection.indexExists('family.nationalID_1').then((exists) => {
//   if (exists) patientModel.collection.dropIndex('family.nationalID_1').then();
// });

=======
>>>>>>> main
export default patientModel;
export { IPatient, FamilyMember };
