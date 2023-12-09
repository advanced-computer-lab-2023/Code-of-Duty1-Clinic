import ChatRoom from '../models/chatroom.model';
import AppointmentModel from '../models/appointment.model';
import mongoose from 'mongoose';
import { User } from '../models';

const saveMessage = async (fromID: string, toID: string, message: string) => {
  let user1ID = fromID;
  let user2ID = toID;

  if (fromID > toID) {
    user1ID = toID;
    user2ID = fromID;
  }

  const chatRoom = await ChatRoom.findOne({ user1ID, user2ID });

  if (!chatRoom) {
    const newChatRoom = new ChatRoom({
      user1ID,
      user2ID,
      messages: [
        {
          sender: fromID,
          content: message
        }
      ]
    });
  } else {
    chatRoom.messages.push({
      sender: new mongoose.Types.ObjectId(fromID),
      content: message
    });
  }
  let result;
  if (chatRoom) {
    result = await chatRoom!.save();
    let wantedMessage = result.messages.filter((m) => m.content == message);
    console.log(wantedMessage, ' v,l,lflv,l,vfl');
    return (wantedMessage[wantedMessage.length - 1] as any)!._id;
  }
  console.log(result, '010101');
};

const getRoomMessages = async (user1ID: string, user2ID: string) => {
  if (user1ID > user2ID) {
    let temp = user1ID;
    user1ID = user2ID;
    user2ID = temp;
  }
  const x = await ChatRoom.findOne({ user1ID, user2ID }).select('messages').lean();
  // console.log(x);
  return x;
};
const getMyPossiblePatients = async (doctorID: string) => {
  return await AppointmentModel.find({ doctorID, status: { $ne: 'Cancelled' } })
    .select('patientID')
    .populate('patientID')
    .lean();
};
const getMyPossibleDoctors = async (patientID: string) => {
  return await AppointmentModel.find({ patientID, status: { $ne: 'Cancelled' } })
    .select('doctorID')
    .populate('doctorID')
    .lean();
};
const getPharmacistsInfo = async () => {
  await User.find({ role: 'Pharmacist' }).lean();
};
const getDoctorsInfo = async () => {
  await User.find({ role: 'Doctor' }).lean();
};
const setMessagesToSeen = async (user1ID: string, user2ID: string, messages: []) => {
  if (user1ID > user2ID) {
    let temp = user1ID;
    user1ID = user2ID;
    user2ID = temp;
  }
  console.log(messages, ' Mes');
  const filter = {
    'messages._id': { $in: messages }
  };

  const update = {
    $set: {
      'messages.$[].isSeen': true
    }
  };
  const x = await ChatRoom.updateMany(filter, update);
  console.log(x, '4858585885');
  return x;
};

export {
  getRoomMessages,
  saveMessage,
  getMyPossiblePatients,
  getMyPossibleDoctors,
  getDoctorsInfo,
  getPharmacistsInfo,
  setMessagesToSeen
};
