const messageModel = require("../models/message.model");

const loadOlderMessages = async (req, res) => {
    try {
        const sender = req.user._id;
        const { id: receiver, before } = req.query;

        if (!before) {
            return res.status(400).json({
                success: false,
                message: "before timestamp is required"
            });
        }

        // 1. Load older messages than the first visible message
        let messages = await messageModel.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ],
            createdAt: { $lt: before } // IMPORTANT
        })
        .sort({ createdAt: -1 }) // newest first
        .limit(15)
        .lean();

        // 2. Reverse for correct UI order
        messages = messages.reverse();

        return res.status(200).json({
            success: true,
            messages,
            hasMore: messages.length === 15
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Unexpected Server Error"
        });
    }
};

module.exports = loadOlderMessages;