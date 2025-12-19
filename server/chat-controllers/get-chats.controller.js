const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");


const getChats = async(req,res)=>{
    try {
        const sender = req.user._id
        const {id} = req.query
        
        const user = await userModel.findById(id).select("-otp -password -email")
        if(!user) return res.status(404).json({success:false, message : "No user found"}) 
        
        return res.status(200).json({
            success : true,
            user
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: error.message|| "Unexpected Server Error"
        });
    }
}

module.exports = getChats