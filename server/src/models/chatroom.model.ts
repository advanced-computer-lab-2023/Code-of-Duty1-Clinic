import mongoose, { Document, Schema } from 'mongoose';

interface ChatMessage {
  sender: mongoose.Schema.Types.ObjectId;
  content: string;
}

interface IChatRoom {
  patientID: mongoose.Schema.Types.ObjectId;
  medicID: mongoose.Schema.Types.ObjectId;
  messages: ChatMessage[];
  date: Date;
}

const chatRoomSchema = new Schema<IChatRoom>({
  patientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: {
    type: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, required: true },
        content: { type: String, required: true }
      }
    ],
    required: true
  },

  date: { type: Date, required: true }
});

chatRoomSchema.index({ patientID: 1 });
chatRoomSchema.index({ medicID: 1 });

const ChatRoomModel = mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);

export default ChatRoomModel;
