const Message = require("../models/message.model")
// ===============================
// Load older messages (scroll top)
// ===============================
const loadOlderMessages = async (req, res) => {
  try {
    const { before,chatid } = req.query; // oldest message time

    if (!chatid || !before) {
      return res.status(400).json({ success:false,message: "Chat ID and before time required" });
    }

    const messages = await Message.find({
      chat: chatid,
      createdAt: { $lt: new Date(before) } // older than oldest loaded
    })
      .sort({ createdAt: -1 }) // newest first
      .limit(15)
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar");

    return res.status(200).json({ success:true,messages });
  } catch (error) {
    console.error("Load older messages error:", error);
    return res.status(500).json({ success: false,message: "Something went wrong" });
  }
};

module.exports =  loadOlderMessages 
