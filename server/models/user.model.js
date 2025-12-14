const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password : {
          type : String ,
          required:true
        },
        avatar: {
            type: Object,
            required : true
        },
        otp : {
            type : Object,
            required : true
        },
        isVerified : {
            type : Boolean,
            default : false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
