const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    text: {
      type: String,
      default: ""
    },

    files: {
        type : Array,default:[]
    },
    tempId : {
        type : String,
        default : ""
    },
    seen: {
      type: String,
      default: "SENT"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Message", messageSchema);