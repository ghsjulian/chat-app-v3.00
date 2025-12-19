const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");


const sendMessage = async(req,res)=>{
    try {
        const sender = req.user._id
        const {id} = req.query
        
        console.log(req.body)
        
        const user = await userModel.findById(id).select("-otp -password -email")
        if(!user) return res.status(404).json({success:false, message : "No user found"}) 
        
        const newMessage = await new messageModel({
            text : "",
            files : [],
            sender : sender,
            receiver : id
        })
        
        return res.status(200).json({
            success : true,
            newMessage,
            message : "Route is okay "
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: error.message|| "Unexpected Server Error"
        });
    }
}

module.exports = sendMessage