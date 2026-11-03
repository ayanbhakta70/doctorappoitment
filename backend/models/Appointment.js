const mongoose= require("mongoose")
const appointmentSchema=new mongoose.Schema(
    {
        doctor:{type: mongoose.Schema.Types.ObjectId, ref:"Doctor",required:true},
        patient:{ type:mongoose.Schema.Types.ObjectId,ref:"User, required:true"},
        date:{ type:String,required:true},      // "format : 2026-11-05"
        timeSlot:{type:String,required:true},    // "10:30"
        reason:String,
        status:{
            type:String,
            enum:["pending","confirmed", "cpmpleted", "cancelled"],
            default:"pending"
        },
    },
    {timestamps:true}
)

module.exports=mongoose.model("Appointment",appointmentSchema)
