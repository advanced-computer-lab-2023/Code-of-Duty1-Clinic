import mongoose from 'mongoose';
import PackageModel, { IPackage, IPackageDocument } from '../models/package.model';

const getPackageById = async (packageID: mongoose.Types.ObjectId) => {
  return await PackageModel.findOne({ _id: packageID });
};

export { getPackageById };
