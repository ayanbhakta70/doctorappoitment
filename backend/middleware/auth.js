const jwt=require("jsonwebtoken")

// chack login Yes or No --------->

exports.protect=(req,res,next)=>{
    // console.log(req.headers.authorization);
    const header=req.headers.authorization;
    if(!header || !header.startsWith("Bearer"))
        return res.status(401).json({message:"please login"});
    try {
        const token=header.split(" ")[1];
        req.user=jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({message:"incorect token"})
    }
}
// chack role------------>
exports.allowRoles= (...roles)=>(req,res,next)=>{
    if(!roles.includes(req.user.role))
        return res.status(403).json({message:"no permission"})
    next();
}
