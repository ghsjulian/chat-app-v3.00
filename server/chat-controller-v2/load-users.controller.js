const Chat = require("../models/chat.model");
const User = require("../models/user.model");

// ===============================
// Find Users / Recent Chats (WhatsApp style)
// ===============================
const loadUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const { next } = req.query;

        // =====================================================
        // When next is present
        // =====================================================
        const chats = await Chat.find({
            participants: currentUserId,
            createdAt: { $lt: new Date(next) }
        })
            .populate("participants", "name avatar")
            .populate({
                path: "lastMessage",
                select: "text createdAt"
            })
            .sort({ updatedAt: -1 })
            .limit(15); // newest first

        const recentChats = chats.map(chat => {
            const otherUser = chat.participants.find(
                user => user._id.toString() !== currentUserId.toString()
            );

            return {
                chatId: chat._id,
                _id: otherUser?._id,
                sender: otherUser?._id,
                name: otherUser?.name,
                avatar: otherUser?.avatar,
                lastMessage: chat.lastMessage?.text || "",
                time: chat.lastMessage?.createdAt || chat.createdAt
            };
        });

        return res.status(200).json({
            type: "recent",
            success: true,
            users: recentChats
        });
    } catch (error) {
        console.error("Find users error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

module.exports = loadUsers;
