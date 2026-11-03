const mongoose=require("mongoose")
const medicineSehema=new mongoose.Schema(
    {
        name:{type:String,required:true},
        genericName:{type:String},
        catagory:{type:String},
        manufacturer:{type:String},
        price:{type:Number,required:true},
        quantity:{type:Number,required:true,default:0},
        lowStockLimit:{type:Number,default:10},
        expireDate:{type:Date,required:true},
    },
    {timestamps:true}
);

module.exports=mongoose.model("Medicine",medicineSehema);