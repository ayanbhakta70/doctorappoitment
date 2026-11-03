const mongoose=require("mongoose")
const doctorSchema=new mongoose.Schema(
    {
        user:{type: mongoose.Schema.Types.ObjectId, ref: "User", required:true, unique:true },
        specialization: { type: String, required: true},
        qualification : String,
        fee: {type: Number, required: true},
        availableDays:[String],
        timeSlots:[String]
    },
    {timestamps: true}
)

module.exports=mongoose.model("Doctor", doctorSchema)