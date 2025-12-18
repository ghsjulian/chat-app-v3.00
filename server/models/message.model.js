const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            default : ""
        },
        files: {
            type : Array ,
          default : []
        },
        sender : {
          type : String ,
          required : true
        },
        receiver: {
            type: String,
            required : true
        }
        
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
