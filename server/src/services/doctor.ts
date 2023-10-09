import UserModel from '../models/user.model';
const getAllDoctorForGuest = async () => {
  try {
    const filter = { role: 'Doctor' };
    const doctors = await UserModel.find(filter, {
      name: 1,
      specialty: 1,
      weeklySlots: 1,
      hourRate: 1,
      hospital: 1,
      vacations: 1,
      gender: 1,
      phone: 1,
      addresses: 1,
      profileImage: 1,
      _id: 1
    });
    return doctors;
  } catch (error) {
    console.error('Error retrieving doctors:', error);
    return error;
  }
};

const searchForDoctorsForGuest = async () => {};
export { getAllDoctorForGuest };
