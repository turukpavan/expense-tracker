const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.model')

const protect =async(req,res,next)=>{
    let token =req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message : "Not Authorized , no token"});

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        // console.log("decoded ====> ",decoded);
        
            req.user = await UserModel.findById(decoded.id).select('-password');
            next();
    } catch (error) {
        res.status(401).json({message : "Not authorized, token failed"});
    }

}

module.exports = protect;