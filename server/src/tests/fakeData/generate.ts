import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import UserModel, {
  IUser,
  IDoctor,
  IPatient,
  FamilyMember,
  IEmergencyContact,
  ICommonUser
} from '../../models/user.model'; // Adjust the path based on your project structure
import { getPackageById } from '../../services/package.service';
const connectionString = 'mongodb://127.0.0.1:27017/clinic';
const generateFakeUser = async (): Promise<IUser> => {
  let user: ICommonUser = {
    name: {
      first: faker.internet.displayName(),
      middle: faker.internet.displayName(),
      last: faker.internet.displayName()
    },
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    birthDate: faker.date.past(),
    gender: randomArrayElement(['Male', 'Female']),
    phone: faker.phone.number(),
    addresses: [faker.location.secondaryAddress()],
    role: 'Patient', //randomArrayElement(['Patient', 'Doctor', 'Administrator']),
    profileImage: faker.image.avatar(),
    isEmailVerified: faker.number.int() % 2 === 0,
    wallet: faker.number.int(),
    isCorrectPassword: async (password: string) => {
      return true;
    }
  };
  let restOfAttributes: IPatient | IDoctor | null = null;
  if (user.role === 'Patient') {
    restOfAttributes = user as IPatient;
    restOfAttributes.family = generateFakeFamily(1);
    restOfAttributes.emergencyContact = generateFakeEmergencyContacts();
    restOfAttributes.medicalHistory = generateFakeMedicalHistory();
    restOfAttributes.package = await generateFakePackageForUser();
  } else if (user.role === 'Doctor') {
    restOfAttributes = user as IDoctor;
    restOfAttributes.hourRate = faker.number.int({ min: 50, max: 200 });
    restOfAttributes.hospital = faker.company.name();
    restOfAttributes.educationBackground = faker.lorem.sentence();
    restOfAttributes.specialty = faker.lorem.word();
    restOfAttributes.weeklySlots = generateFakeWeeklySlots();
    restOfAttributes.vacations = generateFakeVacations();
  }

  return { ...user, ...restOfAttributes };
};

const generateFakeFamily = (familyCount: number): FamilyMember[] => {
  let family = [];
  for (let i = 0; i < familyCount + 1; i++) {
    family.push(generateFamilyMember());
  }

  return [];
};
const generateFamilyMember = () => {
  return {
    name: faker.internet.displayName(),
    nationalID: faker.number.int({ min: 0, max: 9 }).toString().repeat(15),
    phone: faker.number.int({ min: 0, max: 9 }).toString().repeat(11),
    relation: randomArrayElement(['Husband', 'Wife', 'Child'])
  };
};
const generateFakeEmergencyContacts = (): IEmergencyContact[] => {
  const emergencyContacts = [];
  for (let i = 0; i < 2; i++) {
    emergencyContacts.push({
      name: faker.internet.displayName(),
      phone: faker.phone.number(),
      relation: randomArrayElement(['Husband', 'Wife', 'Child'])
    });
  }

  return emergencyContacts;
};

const generateFakeMedicalHistory = (): { name: string; medicalRecord: string }[] => {
  const medicalHistory = [];
  for (let i = 0; i < 3; i++) {
    medicalHistory.push({
      name: faker.lorem.word(),
      medicalRecord: faker.lorem.sentence()
    });
  }

  return medicalHistory;
};
import PackageModel from '../../models/package.model';

const generateFakePackage = async () => {
  const pkg = {
    name: randomArrayElement(['Gold', 'Silver', 'Platinum']),
    price: faker.number.int({ min: 100, max: 2000 }),
    sessionDiscount: faker.number.int({ min: 0, max: 99 }),
    medicineDiscount: faker.number.int({ min: 0, max: 99 }),
    familyDiscount: faker.number.int({ min: 0, max: 99 }),
    isLatest: true
  };
  mongoose.connect(connectionString);
  const newPkg = new PackageModel(pkg);
  await newPkg.save();
  return newPkg;
};
const getPackageId = () => {
  return generateFakePackage().then((result) => result._id);
};
const generateFakePackageForUser = async (): Promise<
  | { packageID: mongoose.Types.ObjectId; packageStatus: 'Subscribed' | 'Unsubscribed' | 'Cancelled'; endDate: Date }
  | undefined
> => {
  const packageID = await getPackageId();
  const packageStatus = randomArrayElement(['Subscribed', 'Unsubscribed', 'Cancelled']);
  const endDate = faker.date.future();
  return { packageID, packageStatus, endDate };
};
const randomArrayElement = (arr: any) => {
  return arr[faker.number.int({ min: 0, max: arr.length })];
};
const generateFakeWeeklySlots = (): { [day: string]: { from: number; to: number; maxPatients: number }[] } => {
  const weeklySlots: { [day: string]: { from: number; to: number; maxPatients: number }[] } = {};
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (const day of daysOfWeek) {
    weeklySlots[day] = [];

    for (let i = 0; i < 10; i++) {
      const startHour = faker.number.int({ min: 8, max: 18 });
      const endHour = startHour + faker.number.int({ min: 1, max: 3 });
      const maxPatients = faker.number.int({ min: 1, max: 10 });

      weeklySlots[day].push({
        from: startHour,
        to: endHour,
        maxPatients
      });
    }
  }

  return weeklySlots;
};
const generateFakeVacations = (): { from: Date; to: Date }[] => {
  const vacations = [];
  for (let i = 0; i < 2; i++) {
    const startDate = faker.date.future({ years: 1 });
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + faker.number.int({ min: 1, max: 10 }));
    vacations.push({
      from: startDate,
      to: endDate
    });
  }
  return vacations;
};

const NUM_USERS_TO_GENERATE = 1;

const generateFakeData = async (): Promise<void> => {
  const fakeUsers: IUser[] = await Promise.all(Array.from({ length: NUM_USERS_TO_GENERATE }, generateFakeUser));
  console.log(fakeUsers);
};

// generateFakeData().then(() => console.log('Fake data generated successfully.'));
console.log(generateFamilyMember());
