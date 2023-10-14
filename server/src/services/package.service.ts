import { StatusCodes } from 'http-status-codes';
import Package from '../models/package.model';
import { HttpError } from '../utils';
import User from '../models/user.model';

// const getPackages = async (query: Object) => {
//   const packages = await Package.find(query);
//   if (!packages) throw new HttpError(StatusCodes.NOT_FOUND, 'No packages found');

//   return {
//     status: StatusCodes.OK,
//     result: packages
//   };
// };

const addPackage = async (packageDetails: any) => {
  const newpackage = new Package(packageDetails);
  await newpackage.save();
  return {
    status: StatusCodes.OK,
    message: 'package created successfully ',
    Package: newpackage
  };
};
const updatePackage = async (id: string, packageDetails: any) => {
  const packageI = await Package.findByIdAndUpdate(
    { _id: id },
    {
      isLatest: false
    }
  );

  if (!packageI) throw new HttpError(StatusCodes.NOT_FOUND, 'update the package failed');
  console.log(packageI);

  const updatedPackageDetails = Object.assign(packageI.toObject(), packageDetails);
  delete updatedPackageDetails._id;
  delete updatedPackageDetails['id'];

  const updatedPackage = new Package(updatedPackageDetails);
  await updatedPackage.save();

  return {
    status: StatusCodes.OK,
    message: 'package is updated successfully',
    result: updatedPackage
  };
};

const deletePackage = async (id: string) => {
  const deletedPackage = await Package.findOneAndDelete({ _id: id });
  if (!deletedPackage) throw new HttpError(StatusCodes.NOT_FOUND, 'Package Not Found');
  await User.updateMany({ 'package.type.packageID': id }, { $set: { package: {} } });
  return {
    status: StatusCodes.OK,
    message: 'Package deleted successfully'
  };
};
const getPackageById = async (packageID: string) => {
  return await Package.findOne({ _id: packageID });
};

export { addPackage, updatePackage, deletePackage, getPackageById };
