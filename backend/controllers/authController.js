const User = require("../models/user");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const makeToken=(user)=>{
    return jwt.sign({id:user._id, role:user.role},process.env.JWT_SECRET,{expiresIn:"7d"});
}

// create new User------------>
exports.register=async(req,res)=>{
    try {
        const {name,email,password,role}=req.body;
        // chack email address exit/don't exit
        const exists=await User.findOne({email});
        if(exists)return res.status(400).json({message:"email allready exist"});
        // password genarate hashing format
        const hashed=await bcrypt.hash(password,10);
        const user=await User.create({name,email,password:hashed, role});
        res.status(201).json({
            token:makeToken(user),
            user:{id:user._id, name:user.name, role:user.role},
        })
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// login user ---------->
exports.login=async(req,res)=>{
    try {
        const{email,password}=req.body;
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:"email address incorrect"});
        const match=await bcrypt.compare(password,user.password);
        if(!match) return res.status(400).json({message:"password incorrect"});

        res.json({
            token:makeToken(user),
            user:{ id:user._id, name:user.name, role:user.role}
        });
    } catch (error) {
         res.status(500).json({message:error.message})
    }
}