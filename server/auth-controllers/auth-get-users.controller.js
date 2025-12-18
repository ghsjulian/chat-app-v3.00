const userModel = require("../models/user.model")

const getUsers = async(req,res)=>{
    try {
        const {term,limit} = req.query

        await Promise.all([
            Product.countDocuments(filter),
            Product.find(filter).sort(sortBy).skip(skip).limit(perPage).lean().exec(),
          ]);
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = getUsers