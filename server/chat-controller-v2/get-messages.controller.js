const Message = require("../models/message.model");
const User = require("../models/user.model");

// ===============================
// Get latest one-to-one messages
// ===============================
const getMessages = async (req, res) => {
    try {
        const { chatid, id } = req.query;
        let user, messages;

        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Receiver ID is required" });
        }
        user = await User.findById(id).select("-otp -password -email");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found"
            });
        }
        if (chatid !== "undefined") {
            messages = await Message.find({ chat: chatid })
                .sort({ createdAt: -1 }) // newest first
                .limit(15)
                .populate("sender", "name avatar")
                .populate("receiver", "name avatar");
        }

        let finalUser = {
            _id: user._id,
            chatid: chatid ? chatid : "",
            name: user.name,
            avatar: user.avatar
        };
        let reverseMessages = messages.reverse()

        return res
            .status(200)
            .json({ success: true, user: finalUser, messages:reverseMessages });
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = getMessages;
