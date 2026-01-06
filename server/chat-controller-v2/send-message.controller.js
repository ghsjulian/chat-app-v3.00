const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const { io, onlineUsers } = require("../socket/index");

// ===============================
// Send Message (WhatsApp style)
// ===============================
const sendMessage = async (req, res) => {
    try {
        const sender = req.user._id;
        const { id } = req.query;
        const { text, files,tempId,seen } = req.body;

        if (text === "" && files?.length == 0)
            return res.status(403).json({
                success: false,
                message: "Message and files required"
            });

        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Receiver ID is required" });
        }

        // 1. Find existing chat between users
        let chat = await Chat.findOne({
            participants: { $all: [sender, id] }
        });
        // 2. If chat does not exist, create it
        if (!chat) {
            chat = await Chat.create({
                participants: [sender, id]
            });
        }

        // 3. Create new message
        const message = await Message.create({
            chat: chat._id,
            sender: sender,
            receiver: id,
            text: text || "",
            seen,
            files: files || [],
            createdAt: new Date(Date.now()).toISOString(),
            tempId
        });

        // 4. Update chat lastMessage
        chat.lastMessage = message._id;
        await chat.save();

        // 5. Populate sender & receiver for frontend
        await message.populate("sender", "name avatar");
        await message.populate("receiver", "name avatar");
        // Send Event To Receiver
        /*
        if(onlineUsers[id]){
        io.to(id).emit("message:receive", message);
        }
        */
        return res.status(201).json({
            success: true,
            newMessage: message,
            message: "Message sent successfully"
        });
    } catch (error) {
        console.error("Send Message Error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = sendMessage;
