import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';
import { Patient, Package } from '../models';

const getPackages = async (query: Object, patientID: string) => {
  const packages = await Package.find({ ...query, isLatest: true }).sort({ price: 1 });
  if (!packages) throw new HttpError(StatusCodes.NOT_FOUND, 'No packages found');

  const patient = await Patient.findById(patientID).select('package');
  let family = patient?.family || [];
  let discount = 0;

  for (let member of family) {
    if (!(member as any).userID) continue;

    const familyMember = await Patient.findById((member as any).userID).select('package');

    if (familyMember && familyMember.package?.packageID) {
      const packageData = await Package.findById(familyMember.package.packageID);

      if (packageData) discount = Math.max(discount, packageData.familyDiscount || 0);
    }
  }

  packages.map((packageI) => {
    packageI.price -= packageI.price * discount;
  });

  return {
    status: StatusCodes.OK,
    result: packages
  };
};

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
  const packageI = await Package.findByIdAndUpdate(id, { isLatest: false });
  if (!packageI) throw new HttpError(StatusCodes.NOT_FOUND, 'update the package failed');

  return {
    status: StatusCodes.OK,
    message: 'Package deleted successfully'
  };
};

export { getPackages, addPackage, updatePackage, deletePackage };
