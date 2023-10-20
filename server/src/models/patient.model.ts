import userModel, { ICommonUser } from './user';
import mongoose, { Schema, Document } from 'mongoose';
const options = { discriminatorKey: 'role' };

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
  gender: 'male' | 'female';
  relation: 'husband' | 'wife' | 'child';
}

type FamilyMember = FamilyMemberWithID | FamilyMemberWithDetails;
interface IEmergencyContact {
  name: string;
  phone: string;
  relation: 'husband' | 'wife' | 'child';
}
interface IPatient extends ICommonUser {
  family: FamilyMember[];
  emergencyContact: IEmergencyContact[];
  medicalHistory: {
    name: string;
    medicalRecord: string;
  }[];
  package: {
    packageID: mongoose.Types.ObjectId;
    packageStatus?: 'subscribed' | 'unsubscribed' | 'cancelled';
    endDate: Date;
  };
}
type IPatientDocument = IPatient & Document;
const patientSchema = new Schema<IPatientDocument>(
  {
    emergencyContact: {
      type: [
        {
          name: { type: String, required: true },
          phone: { type: String, required: true },
          relation: { type: String, enum: ['husband', 'wife', 'child'], required: true }
        }
      ],
      required: true
    },
    family: {
      type: [
        {
          userID: mongoose.Types.ObjectId,
          name: String,
          nationalID: String,
          phone: String,
          birthDate: Date,
          gender: { type: String, enum: ['male', 'female'] },
          relation: {
            type: String,
            enum: ['husband', 'wife', 'child'],
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
    }
  },
  options
);

const patientModel: mongoose.Model<IPatientDocument> = userModel.discriminator('patient', patientSchema);
export default patientModel<IPatientDocument>;
