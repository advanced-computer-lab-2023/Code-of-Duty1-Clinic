import ChatRoom from '../models/chatroom.model';
import AppointmentModel from '../models/appointment.model';
import mongoose from 'mongoose';
import { User } from '../models';

const saveMessage = async (fromID: string, toID: string, message: string) => {
  let user1ID = fromID < toID ? fromID : toID;
  let user2ID = fromID > toID ? fromID : toID;

  let chatRoom = await ChatRoom.findOne({ user1ID, user2ID });

  if (!chatRoom) {
    chatRoom = new ChatRoom({
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

  const result = await chatRoom.save();
  const wantedMessage = result.messages.find((m) => m.content == message && m.sender.toString() == fromID);

  if (wantedMessage) {
    console.log(wantedMessage, ' v,l,lflv,l,vfl');
    return (wantedMessage as any)._id;
  }
  return {};
  console.log(result, '010101');
};
const countUnseenMessages = async (user1ID: string, user2ID: string) => {
    const  senderID =  user2ID
    if (user1ID > user2ID) {
    let temp = user1ID;
    user1ID = user2ID;
    user2ID = temp;
  }
    console.log('Querying ChatRoom with user1ID:', user1ID, 'and user2ID:', user2ID);
    const results = await ChatRoom.findOne({ user1ID:user1ID, user2ID:user2ID });
    // console.log(results);
  if (!results) return { count: 0 };
    
    const count = results.messages.filter((m) => m.sender.toString() === senderID && !m.isSeen).length;
    console.log(count);
    return { count : count };
};


const getRoomMessages = async (user1ID: string, user2ID: string) => {
  if (user1ID > user2ID) {
    let temp = user1ID;
    user1ID = user2ID;
    user2ID = temp;
  }
  const x = await ChatRoom.findOne({ user1ID, user2ID }).select('messages').lean();
  console.log(x, "2222222222222");
  if (!x)
    return { messages:[]};
  return x;
};
const getMyPossiblePatients = async (doctorID: string) => {
  const appointments = await AppointmentModel.find({ doctorID, status: { $ne: 'Cancelled' } })
    .select('patientID')
    .populate('patientID')
    .lean();

 
  const patients = appointments.filter((appointment, index, array) => { 
   const currentPatientID = appointment.patientID.toString();
    return array.findIndex(a => a.patientID.toString() === currentPatientID) === index;

  }).map((appointment) => {
    return {
      userID: appointment.patientID,
    };
  });
  console.log(patients);
  return patients;
};

const getMyPossibleDoctors = async (patientID: string) => {
  const appointments = await AppointmentModel.find({ patientID, status: { $ne: 'Cancelled' } })
    .select('doctorID')
    .populate('doctorID')
    .lean();

  
  const doctors = appointments.filter((appointment, index, array) => { 
   const currentDoctorID = appointment.doctorID.toString();
    return array.findIndex(a => a.doctorID.toString() === currentDoctorID) === index;

  }).map((appointment) => {
    return {
     
      userID: appointment.doctorID,
    };
  });
  console.log(doctors);
  return doctors;
};

const getPharmacistsInfo = async () => {
  let pharmacists = await User.find({ role: 'Pharmacist' }).lean();
  let pharmacistsModified = pharmacists.map((pharmacist) => {
    return {
      userID: pharmacist
    }
  });
  return pharmacistsModified;
};
const getDoctorsInfo = async () => {

  let doctors = await User.find({ role: 'Doctor' }).lean()
  let doctorsModified = doctors.map((pharmacist) => {
    return {
      userID: pharmacist
    }
  });
  console.log(doctorsModified, " 879");
  return doctorsModified;
 
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
const getPatientsForPharmacist = async (pharmacistID: string) => {
  let patients = await User.find({ role: 'Patient' }).select('_id');
  let patientIds = patients.map(patient => patient._id); 
  let chatRooms = await ChatRoom.find({
    $or: [
      { user1ID: pharmacistID, user2ID: { $in: patientIds } },
      { user2ID: pharmacistID, user1ID: { $in: patientIds } }
    ]
  }).populate('user1ID user2ID'); 

  let patientConversations = chatRooms.map(room => {
   
    return (room.user1ID as any).role.toString() === 'Patient' ? room.user1ID : room.user2ID;
  });

  let result  = patientConversations.map((room) => { 
    return {
      userID: room
    }
  });
  console.log(result);
  return result;
}
export {
  getRoomMessages,
  saveMessage,
  getMyPossiblePatients,
  getMyPossibleDoctors,
  getDoctorsInfo,
  getPharmacistsInfo,
    setMessagesToSeen,
  countUnseenMessages,
  getPatientsForPharmacist
};
