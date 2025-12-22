const mongoose = require("mongoose");
const Message = require("../models/message.model");
const User = require("../models/user.model");

const chatUsersController = async (req, res) => {
    try {
        const currentUserId = req.user._id.toString();
        const { term, limit = 15 } = req.query;

        // ==================================================
        // CASE 1: SEARCH USERS (exclude logged-in user)
        // ==================================================
        if (term && term.trim() !== "") {
            const users = await User.find({
                _id: { $ne: currentUserId },
                $or: [
                    { name: { $regex: term, $options: "i" } },
                    { email: { $regex: term, $options: "i" } }
                ]
            })
                .select("name email avatar")
                .limit(Number(limit))
                .lean();

            return res.status(200).json({
                success: true,
                users
            });
        }

        // ==================================================
        // CASE 2: RECENT CHATS (WhatsApp style)
        // ==================================================

        // 1️⃣ Get all messages where current user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        }).limit(limit)
            .sort({ createdAt: -1 }) // newest first
            .lean();

        // 2️⃣ Store latest message per chat user
        const chatsMap = new Map();

        for (const msg of messages) {
            // find the OTHER user (never current user)
            const otherUserId =
                msg.sender.toString() === currentUserId
                    ? msg.receiver.toString()
                    : msg.sender.toString();

            // skip if already added (we already have newest message)
            if (chatsMap.has(otherUserId)) continue;

            chatsMap.set(otherUserId, {
                sender : msg.sender,
                lastMessage:
                    msg.text || `Sent ${msg?.files?.length || 0} files`,
                lastMessageAt: msg.createdAt
            });

            // stop when limit reached
            if (chatsMap.size >= Number(limit)) break;
        }

        // if no chats found
        if (chatsMap.size === 0) {
            return res.status(200).json({
                success: true,
                users: []
            });
        }

        // ==================================================
        // FETCH CHAT USERS (exclude current user)
        // ==================================================
        const chatUserIds = Array.from(chatsMap.keys());

        const users = await User.find({
            _id: { $in: chatUserIds }
        })
            .select("name email avatar")
            .lean();

        // ==================================================
        // MERGE USER DATA + LAST MESSAGE (KEEP ORDER)
        // ==================================================
        const result = chatUserIds.map(userId => {
            const user = users.find(u => u._id.toString() === userId);

            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                sender: chatsMap.get(userId).sender,
                lastMessage: chatsMap.get(userId).lastMessage,
                lastMessageAt: chatsMap.get(userId).lastMessageAt
            };
        });

        // ==================================================
        // FINAL RESPONSE
        // ==================================================
        const filteredResult = result.filter(
    user => user._id.toString() !== currentUserId
);
        res.status(200).json({
            success: true,
            users: filteredResult
        });
    } catch (error) {
        console.error("chatUsersController error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = chatUsersController;
