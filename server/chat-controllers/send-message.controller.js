const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");

const sendMessage = async (req, res) => {
    try {
        const sender = req.user._id;
        const { id } = req.query;
        const { text, files } = req.body;

        if (text === "" && files?.length == 0)
            return res.status(403).json({
                success: false,
                message: "Message and files required"
            });

        const user = await userModel
            .findById(id)
            .select("-otp -password -email");
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "No user found" });

        const newMessage = await new messageModel({
            text: text ? text : "",
            files,
            sender: sender,
            receiver: id
        });
        await newMessage.save()
        return res.status(200).json({
            success: true,
            newMessage,
            message: "Message sent successfully"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Unexpected Server Error"
        });
    }
};

module.exports = sendMessage;
