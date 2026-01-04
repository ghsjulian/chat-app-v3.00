const Chat = require("../models/chat.model");
const User = require("../models/user.model");

// ===============================
// Find Users / Recent Chats (WhatsApp style)
// ===============================
const findUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const { term } = req.query;

        // =====================================================
        // CASE 1: SEARCH USERS (when term exists)
        // =====================================================
        if (term) {
            const regex = new RegExp(term, "i");

            const users = await User.find({
                _id: { $ne: currentUserId },
                name: regex
            })
                .select("name avatar")
                .limit(15);

            return res.status(200).json({
                type: "search",
                success: true,
                users
            });
        }

        // =====================================================
        // CASE 2: RECENT CHATS (when term does NOT exist)
        // =====================================================
        const chats = await Chat.find({
            participants: currentUserId
        })
            .populate("participants", "name avatar")
            .populate({
                path: "lastMessage",
                select: "_id text createdAt seen sender"
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
                sender: chat?.lastMessage?.sender,
                name: otherUser?.name,
                avatar: otherUser?.avatar,
                lastMessage:
                    chat.lastMessage?.text ||
                    "sent a file",
                    
                time: chat.lastMessage?.createdAt || chat.createdAt,
                seen: chat?.lastMessage?.seen,
                messageId : chat?.lastMessage?._id
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

module.exports = findUsers;
