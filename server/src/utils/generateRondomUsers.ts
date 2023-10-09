import mongoose, { Schema } from 'mongoose';
import UserModel, { IUser, IPatient, IDoctor, ICommonUser, IUserDocument } from '../models/user.model'; // Update with the correct path
import config from '../../config/DB&ServerConfig';

// Function to generate a random date within a given range
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Function to generate a random phone number
const getRandomPhone = (): string => {
  const randomNumber = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(10, '0');
  return `+1${randomNumber}`;
};

// Function to generate a random user
const generateUser = (role: 'Administrator' | 'Patient' | 'Doctor'): IUser => {
  const username = `use8r_${Math.floor(Math.random() * 100000)}`;
  const email = `${username}@example.com`;
  const password = '12345';

  const commonUserData = {
    name: {
      first: 'John',
      middle: '',
      last: 'Doe'
    },
    email,
    username,
    password,
    birthDate: getRandomDate(new Date(1980, 0, 1), new Date(2000, 0, 1)),
    gender: 'Male',
    phone: getRandomPhone(),
    addresses: ['123 Main St'],
    role,
    profileImage: 'default.jpg',
    isEmailVerified: true,
    wallet: 0
  };

  if (role === 'Patient') {
    console.log('patient');
    return {
      ...commonUserData,
      emergencyContact: [
        {
          name: 'Emergency Contact',
          phone: getRandomPhone(),
          relation: 'Husband'
        }
      ],
      family: [
        {
          userID: new mongoose.Types.ObjectId(),
          name: 'Family Member',
          nationalID: '12345678901234',
          phone: getRandomPhone(),
          relation: 'Wife'
        }
      ],
      medicalHistory: [
        {
          name: 'Condition4',
          medicalRecord: 'Record 1'
        }
      ]
    } as IUser;
  } else if (role === 'Doctor') {
    console.log('pdoctor ');
    return {
      ...commonUserData,
      hourRate: Math.floor(Math.random() * 100) + 50,
      hospital: 'City Hospital',
      educationBackground: 'Medical School',
      specialty: 'Cardiology',
      weeklySlots: {
        Monday: [
          { from: 9, to: 12, maxPatients: 5 },
          { from: 14, to: 18, maxPatients: 7 }
        ],
        Wednesday: [{ from: 10, to: 13, maxPatients: 6 }]
      },
      vacations: [
        {
          from: getRandomDate(new Date(), new Date(2022, 2, 1)),
          to: getRandomDate(new Date(2022, 2, 10), new Date(2022, 2, 20))
        }
      ]
    } as IDoctor;
  } else {
    console.log('admin');
    return {
      ...commonUserData
    } as ICommonUser;
  }
};

// Function to generate and save users
const generateAndSaveUsers = async () => {
  //   console.log(mongoose.connection);
  try {
    // Clear existing users
    // await UserModel.deleteMany({}).then(() => console.log('fffffffffffffffffffffffffff'));
    // Generate and save 1 admin, 3 patients, and 2 doctor  s

    // print();
    console.log(generateUser('Administrator'));
    const usersToCreate = [
      generateUser('Administrator'),
      generateUser('Patient'),
      generateUser('Patient'),
      generateUser('Patient'),
      generateUser('Doctor'),
      generateUser('Doctor')
    ];

    const createdUsers = await UserModel.create(usersToCreate);

    console.log('Users created successfully:', createdUsers);
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};
mongoose
  .connect(config.DB.URL, {})
  .then(() => {
    // UserModel.deleteMany({}).then(() => console.log('fffffffffffffffffffffffffff'));
    // const username = `user_${Math.floor(Math.random() * 100000)}`;
    // const c = new UserModel({
    //   name: { first: 'John', middle: '', last: 'Doe' },
    //   email: `${username}@example.com`,
    //   username: username,
    //   password: '12345',
    //   birthDate: new Date('1986-09-20T16:53:42.473Z'), // Correct date format
    //   gender: 'Male',
    //   phone: '+10167687935',
    //   addresses: ['123 Main St'],
    //   role: 'Administrator',
    //   profileImage: 'default.jpg',
    //   isEmailVerified: true,
    //   wallet: 0,
    //   package: {
    //     endDate: new Date(1), // Provide a default or valid value for endDate
    //     packageStatus: 'subscribed', // Provide a default or valid value for packageStatus
    //     packageID: new mongoose.Types.ObjectId() // Provide a default or valid value for packageID
    //   }

    //   });
    //     return c.save();
    // UserModel.findById('6522e2220db6c2f317f4c6a8').then((x) => console.log(x, typeof x));
    generateAndSaveUsers();
  })
  .then((savedUser) => {
    console.log('User saved successfully:', savedUser);
  })
  .catch((e) => console.log('vgvv', e));
// Connect to the database and generate users
