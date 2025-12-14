const logoutController = async(req,res)=>{
    try {
        res.cookie("chatappv3", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
   // domain: "http://localhost:5000",
    path: "/",
  });
        return res.status(200).json({
            success : true,
            message : "Logged Out Successfully"
        })
    } catch (error) {
        return res.status(505).json({
            success : false,
            message : error.message|| "Unexpected Server Error"
        })
    }
}

module.exports = logoutController