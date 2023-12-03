import ChatRoom from "../models/chatroom.model";
import mongoose from "mongoose";
// import mongoose from "mongoose";

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
                    sender: new mongoose.Schema.Types.ObjectId(fromID),
                    content: message
                }
            ]
        });
        await newChatRoom.save();
        return;
    } else {
        chatRoom.messages.push({
            sender: new mongoose.Schema.Types.ObjectId(fromID),
            content: message
        });
        await chatRoom.save();
    }
};
const getRoomMessages = (user1ID: string, user2ID: string) => {
    // TODO: Implement this function
    if (user1ID > user1ID) {
        let temp = user1ID;
        user1ID = user2ID;
        user2ID = temp;
    }
    return ChatRoom.findOne({ user1ID, user2ID }).select('messages');
}