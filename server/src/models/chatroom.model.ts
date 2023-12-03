import mongoose, { Document, Schema } from 'mongoose';

interface ChatMessage {
  sender: mongoose.Schema.Types.ObjectId;
  content: string;
}

interface IChatRoom {
  user1ID: mongoose.Schema.Types.ObjectId;
  user2ID: mongoose.Schema.Types.ObjectId;
  messages: ChatMessage[];
  date?: Date;
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
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true }
      }
    ],
    required: true
  },

  date: { type: Date, default: Date.now() }
});

chatRoomSchema.index({ user1ID: 1 });
chatRoomSchema.index({ user2ID: 1 });

const ChatRoom = mongoose.model<IChatRoomDocument>('ChatRoom', chatRoomSchema);

export default ChatRoom;
export { IChatRoom };
