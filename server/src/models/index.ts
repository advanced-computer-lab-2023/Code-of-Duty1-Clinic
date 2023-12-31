import User, { ICommonUser, ICommonUserDocument } from './user.model';
import Doctor, { IDoctor, DailySchedule } from './doctor.model';
import Patient, { IPatient, FamilyMember } from './patient.model';
import Admin, { IAdmin } from './admin.model';
import Request, { IRequest } from './request.model';
import Contract, { IContract } from './contract.model';
import Package, { IPackage } from './package.model';
import Notification, { INotification } from './notification.model';
import Appointment, { IAppointment } from './appointment.model';
import Prescription, { IPrescription } from './prescription.model';
import ChatRoom, { IChatRoom } from './chatroom.model';
import Pharmacist, { IPharmacist } from './pharmacist.model';
import Medicine, { IMedicine } from './medicine.model';
import Order, { IOrder } from './order.model';
import Cart, { ICart } from './cart.model';

export {
  // Unique exports
  User,
  Doctor,
  Patient,
  Admin,
  Request,
  Contract,
  Package,
  Notification,
  Appointment,
  Prescription,
  ChatRoom,
  Pharmacist,
  Medicine,
  Cart,
  Order,

  // Common interfaces
  ICommonUser,
  IDoctor,
  IPatient,
  FamilyMember,
  IAdmin,
  IRequest,
  IContract,
  IPackage,
  INotification,
  IAppointment,
  IPrescription,
  IChatRoom,
  DailySchedule,
  IPharmacist,
  IMedicine,
  ICart,
  IOrder
};
