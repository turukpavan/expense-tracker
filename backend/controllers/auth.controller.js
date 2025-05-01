const UserModel = require("../models/User.model.js")
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn : "10h"});
};

//Register User
const registerUser = async (req,res)=>{
    const  {fullName, email, password, profileImageUrl} = req.body;

    // Validation check for missing fields
    if(!fullName || !email || !password) return res.status(400).json({message : "All fields are required"})
    
    try {
        //Check if email already exists
        const existingUser = await UserModel.findOne({email});
        if(existingUser) return res.status(400).json({message : "Email already in use"})

        //create User
        const user = await UserModel.create({fullName, email, password, profileImageUrl})
        res.status(201).json({id:user._id, user,token : generateToken(user._id)});
    } catch (err) {
        res.status(500).json({message : "Error while registering user => ", error : err.message});
    }
};

//Login USer
const loginUser = async (req, res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).json({message : "All fields are required"});

    try {
        const user = await UserModel.findOne({email});
        if (!user || !(await user.comparePassword(password))) return res.status(404).json({message : "INVALID CREDENTIALS"});

        res.status(200).json({id : user._id,user, token : generateToken(user._id)});
    } catch (err) {
        res.status(500).json({message : "Error while registering user => ", error : err.message});
  
    }


};

//Register User
const getUserInfo = async (req,res)=>{
    try {
        const user = await UserModel.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({message:"Error while finding user ==>",error:err.message})
    }
}
module.exports= {registerUser, loginUser, getUserInfo}