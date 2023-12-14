import mongoose, { Document, Schema } from 'mongoose';

interface ChatMessage {
  sender: mongoose.Types.ObjectId;
  content: string;
  isSeen?: boolean;
  date?: Date;
}

interface IChatRoom {
  user1ID: mongoose.Schema.Types.ObjectId;
  user2ID: mongoose.Schema.Types.ObjectId;
  messages: ChatMessage[];
}

type IChatRoomDocument = IChatRoom & Document;

const chatRoomSchema = new Schema<IChatRoomDocument>({
  user1ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: {
    type: [
      {
        sender: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        date: { type: Date, default: Date.now() },
        isSeen: { type: Boolean, default: false }
      }
    ],
    required: true
  }
});

// chatRoomSchema.index({ user1ID: 1 });
// chatRoomSchema.index({ user2ID: 1 });
chatRoomSchema.index({ 'messages._id': 1 });
const ChatRoom = mongoose.model<IChatRoomDocument>('ChatRoom', chatRoomSchema);

export default ChatRoom;
export { IChatRoom };
