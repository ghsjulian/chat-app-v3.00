const mongoose = require("mongoose");
const Message = require("../models/message.model");
const User = require("../models/user.model");

const chatUsersController = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { term, limit = 10 } = req.query;

        // ==================================================
        // CASE 1: SEARCH USERS
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
        // CASE 2: RECENT CHATS (FIND + SORT + MAP)
        // ==================================================

        // 1️⃣ get all messages of current user (newest first)
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        })
            .sort({ createdAt: -1 }) // newest message first
            .lean();

        // 2️⃣ Map to store latest message per user
        const chatsMap = new Map();

        for (const msg of messages) {
            // find other user in this message
            const chatUserId =
                msg.sender.toString() === currentUserId
                    ? msg.receiver.toString()
                    : msg.sender.toString();

            // if already added, skip (we already have newest)
            if (chatsMap.has(chatUserId)) continue;

            // store latest message for this user
            chatsMap.set(chatUserId, {
                sender: msg.sender.toString(),
                lastMessage: msg.text || `Sent ${msg?.files?.length} files`,
                lastMessageAt: msg.createdAt
            });

            // stop if limit reached
            if (chatsMap.size >= Number(limit)) break;
        }

        // if no chats
        if (chatsMap.size === 0) {
            return res.status(200).json({
                success: true,
                users: []
            });
        }

        // ==================================================
        // FETCH USER DETAILS
        // ==================================================
        const userIds = Array.from(chatsMap.keys());

        const users = await User.find({ _id: { $in: userIds } })
            .select("name email avatar")
            .lean();

        // ==================================================
        // MERGE USER + CHAT DATA (KEEP ORDER)
        // ==================================================
        const result = userIds.map(userId => ({
            ...users.find(u => u._id.toString() === userId),
            sender: chatsMap.get(userId).sender,
            lastMessage: chatsMap.get(userId).lastMessage,
            lastMessageAt: chatsMap.get(userId).lastMessageAt
        }));

        // ==================================================
        // FINAL RESPONSE
        // ==================================================
        res.status(200).json({
            success: true,
            users: result
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
