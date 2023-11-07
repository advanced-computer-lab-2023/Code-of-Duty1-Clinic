import User, { ICommonUser } from './user.model';
import mongoose, { Schema, Document } from 'mongoose';

const options = { discriminatorKey: 'role' };

interface IAdmin extends ICommonUser {}

type IAdminDocument = IAdmin & Document;

const adminSchema = new Schema({}, options);

const adminModel: mongoose.Model<IAdminDocument> = User.discriminator('Admin', adminSchema);

export default adminModel;
export { IAdmin };
