import User, { ICommonUser, ICommonUserDocument } from './user.model';
import Doctor, { IDoctor, DailySchedule } from './doctor.model';
import Patient, { IPatient } from './patient.model';
import Admin, { IAdmin } from './admin.model';
import Request, { IRequest } from './request.model';
import Contract, { IContract } from './contract.model';
import Package, { IPackage } from './package.model';
import Notification, { INotification } from './notification.model';
import Appointment, { IAppointment } from './appointment.model';
import Prescription, { IPrescription } from './prescription.model';
import ChatRoom, { IChatRoom } from './chatroom.model';

export { User, Doctor, Patient, Admin, Request, Contract, Package, Notification, Appointment, Prescription, ChatRoom };
export type {
  ICommonUser,
  IDoctor,
  IPatient,
  IAdmin,
  IRequest,
  IContract,
  IPackage,
  INotification,
  IAppointment,
  IPrescription,
  IChatRoom,
  DailySchedule
};
