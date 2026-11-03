const mongoose=require("mongoose")
const SaleSchema=new mongoose.Schema(
    {
        customerName:{type:String,default:"walk-in Customer"},
        items:[
            {
                medicine:{type:mongoose.Schema.Types.ObjectId, ref:"Medicine"},
                name:String,
                price:Number,
                quantity:Number
            },
        ],
        totalAmount:{ type:Number,required:true},
        soldBy:{ type:mongoose.Schema.Types.ObjectId,ref:"User"},
    },
    {
        timestamps:true
    }
);
module.exports=mongoose.model("Sale",SaleSchema)