import mongoose, { Date, Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt'; 

interface EmergencyContact {
  name: string;
  phone: string;
  relation: 'Husband' | 'Wife' | 'Child';
}

interface FamilyMember {
  userId?: mongoose.Types.ObjectId;
  name?: string;
  nationalID?: string;
  phone?: string;
  relation: 'Husband' | 'Wife' | 'Child';
}

interface MedicalHistory {
  name: string;
  medicalRecord: string;
}

interface Prescription {
  medicine: string;
  dosage: string;
}

interface User {
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
    packageID: string;
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
    sessionTime?: Number
    availableSlots?: {
        day: string;
        slots: number[];
    }[];

    doctorRequestStatus?: 'Pending' | 'Accepted' | 'Rejected';
}

const userSchema = new Schema<User & Document>({
    name: {
        first: { type: String, required: true },
        middle: { type: String, required: false },
        last: { type: String, required: true },
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
            relation: { type: String, enum: ['Husband', 'Wife', 'Child'], required: true },
        },
        required: function () {
            return this.role === 'Patient';
        },
    },
    family: {
        type: [
            {
                userId: { type: mongoose.Types.ObjectId, required: false },
                name: { type: String, required: false },
                nationalID: { type: String, required: false },
                phone: { type: String, required: false },
                relation: { type: String, enum: ['Husband', 'Wife', 'Child'], required: true },
            },
        ],
        required: function () {
            return this.role === 'Patient';
        },
        validate: {
            validator: function (arr: FamilyMember[]) {
                // 'this' refers to the document being saved
                const hasNameNationalIDPhone = (arr[arr.length - 1].name || arr[arr.length - 1].nationalID || arr[arr.length - 1].phone) && !(arr[arr.length - 1].userId || arr[arr.length - 1].relation);
                const hasUserIdRelation = (arr[arr.length - 1].userId || arr[arr.length - 1].relation) && !(arr[arr.length - 1].name || arr[arr.length - 1].nationalID || arr[arr.length - 1].phone);

                return Boolean(hasNameNationalIDPhone || hasUserIdRelation);
            },
            message: 'Either name, nationalID, and phone should be provided, or userId and relation should be provided.',
        }
    },
    medicalHistory: {
        type: [
            {
                name: { type: String, required: true },
                medicalRecord: { type: String, required: true },
            },
        ],
        required: function () {
            return this.role === 'Patient';
        }
    },
    package: {
        type: {
            packageID: { type: String, required: true },
            packageStatus: {
                type: String,
                enum: ['subscribed with renewal date', 'unsubscribed', 'cancelled with end date'],
                required: true,
            },
            endDate: { type: Date, required: true },
        },
        required: function () {
            return this.role === 'Patient';
        }
    },
  
    hourRate: { type: Number, required: function () { return this.role === 'Doctor'; } },
    hospital: { type: String, required: function () { return this.role === 'Doctor'; } },
    educationBackground: { type: String, required: function () { return this.role === 'Doctor'; } },
    specialization: { type: String, required: function () { return this.role === 'Doctor'; } },
    medicalDegree: { type: String, required: function () { return this.role === 'Doctor'; } },
    medicalLicenses:
    {
        type: [
            {
                licenseID: { type: String, required: true },
                licenseImage: { type: String, required: true },
            },
        ],
        required: function () {
            return this.role === 'Doctor';
        }
    },
    acceptedContractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: function (this: { role?: string }) {
        return this.role === 'Doctor';
    }
},

    sessionTime: { type: Number, required: function () { return this.role === 'Doctor' } },
    availableSlots: {
        type: [
            {
                day: { type: String, required: true },
                slots: { type: [Number], required: true },
            },
        ],
        required: function () {
            return this.role === 'Doctor';
        }
    },
    doctorRequestStatus : {type:String ,enum: [ 'Pending' , 'Accepted' , 'Rejected'], required: function () { return this.role === 'Doctor' }},

    
});
userSchema.pre<User & Document>('save', function (next) {

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
userSchema.index({ _id: 1 });

const UserModel = mongoose.model<User & Document>('User', userSchema);
export default UserModel;
