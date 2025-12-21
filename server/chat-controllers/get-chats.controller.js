const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");

const getChats = async (req, res) => {
    try {
        const sender = req.user._id;
        const { id: receiver } = req.query;
        // 1. Get user info
        const user = await userModel
            .findById(receiver)
            .select("-otp -password -email");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found"
            });
        }

        // 2. Get last 10 messages (newest first)
        let messages = await messageModel
            .find({
                $or: [
                    { sender, receiver },
                    { sender: receiver, receiver: sender }
                ]
            })
            .sort({ createdAt: -1 }) // newest first
            .limit(10)
            .lean();
        // 3. Reverse messages so frontend gets oldest → newest
        messages = messages.reverse();

        // 4. Send response
        return res.status(200).json({
            success: true,
            user,
            messages
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Unexpected Server Error"
        });
    }
};

module.exports = getChats;
