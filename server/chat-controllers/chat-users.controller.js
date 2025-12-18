const Message = require("../models/message.model");
const User = require("../models/user.model");

const chatUsersController = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const { term, limit = 10 } = req.query;

        // ===============================
        // CASE 1: SEARCH USERS (term exists)
        // ===============================
        if (term && term.trim() !== "") {
            const users = await User.find({
                _id: { $ne: loggedInUserId },
                $or: [
                    { name: { $regex: term, $options: "i" } },
                    { email: { $regex: term, $options: "i" } }
                ]
            })
            .select("name email avatar")
            .limit(Number(limit));

            return res.status(200).json({
                success: true,
                users
            });
        }

        // =================================
        // CASE 2: DEFAULT – RECENT CHATS
        // =================================
        const chats = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: loggedInUserId },
                        { receiver: loggedInUserId }
                    ]
                }
            },
            {
                $project: {
                    chatUser: {
                        $cond: [
                            { $eq: ["$sender", loggedInUserId] },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    text: 1,
                    createdAt: 1
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$chatUser",
                    lastMessage: { $first: "$text" },
                    lastMessageAt: { $first: "$createdAt" }
                }
            },
            { $sort: { lastMessageAt: -1 } },
            { $limit: Number(limit) }
        ]);

        const userIds = chats.map(chat => chat._id);

        const users = await User.find({ _id: { $in: userIds } })
            .select("name email avatar")
            .lean();

        // Merge last message info
        const usersWithChatData = users.map(user => {
            const chat = chats.find(c => c._id.toString() === user._id.toString());
            return {
                ...user,
                lastMessage: chat?.lastMessage || "",
                lastMessageAt: chat?.lastMessageAt
            };
        });

        return res.status(200).json({
            success: true,
            users: usersWithChatData
        });

    } catch (error) {
        console.error("Chat users error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = chatUsersController;