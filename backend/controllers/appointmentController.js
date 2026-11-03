const Appointment=require("../models/Appointment")
const Doctor=require("../models/Doctor")

// Book Appointment (patient)-------->>
exports.bookAppointment=async (req,res)=>{
    try {
        const {doctor, date, timeSlot, reason}=req.body;

        const doc=await Doctor.findById(doctor);
        if (!doc) return res.status(404).json({message:"Doctor not Available"});

        // Previous Date Cancle --------------------->>
        if(date < new Date().toISOString().slice(0,10))
            return res.status(400).json({message:"Doesn't booking Previous Date"})

        // Does the doctor see patient that day ??  --------->>
        const day= new Date(date).toLocaleDateString("en-US",{
            weekday: "long",
            timeZone: "UTC",
        })
        if(!doc.availableDays.includes(day))
            return res.status(400).json({message: `Doctor  is not available on ${day}`});

        // The slot is in the doctor's list------------------->>
        if(!doc.timeSlots.includes(timeSlot))
            return res.status(400).json({message : "Not available in this time"});
        
        // Chack Allready booking  yes or no ------------------------->>>
        const taken=await Appointment.findOne({
            doctor,
            date,
            timeSlot,
            status:{$ne:"cancelled"},            
        });
        if(taken) return res.status(400).json({message: "Allready Booking in this patient"});
        
        const appointmet= await Appointment.create({
            doctor,
            patient: req.user.id ,
            date,
            timeSlot,
            reason
        });

        res.status(201).json(appointmet)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// Patient personal Appointment---------------------------->>
exports.myAppointments= async (req,res)=>{
    try {
        const list= await Appointment.find({patient: req.user.id})
            .populate({path: "doctor",populate: {path: "user",select: "name"}})
            .sort({ date: -1});
        res.json(list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// Doctor's Appointment list ------------------------>>>
exports.doctorAppointments= async (req,res)=>{
    try {
        const doc= await Doctor.findOne({user: req.user.id});
        if(!doc) return res.status(404).json({message: "Create your Profile"});

        const list = await Appointment.find({ doctor: doc._id})
            .populate("patient","name,email")
            .sort({date: 1})
        res.json(list)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// Change Status (Doctor/admin) : confrimed,"completed","cancelled" ----------------------->>>
exports.updateStatus=async (req,res)=>{
    try {
        const {status}= req.body
        if(!["confrimed","completed","cancelled"].includes(status))
            return res.status(400).json({message: "Status incorrect"});

        const appointmet=await Appointment.findByIdAndUpdate(
            req.params.id,
            {status},
            {new:true}
        );
        if(!appointmet) return res.status(404).json({message: "Couldn't get an Appointment"});
        res.json(appointmet);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// Patient will cancle their won Appointment -------------------->>
exports.cancleAppointment=async (req,res)=>{
    try {
        const appointmet=await Appointment.findOne({
            _id: req.params.id,
            patient: req.user.id
        })
        if(!appointmet) return res.status(404).json({message:"Couldn't get an Appointment"});
        appointmet.status="cancelled"
        await appointmet.save();
        res.json(appointmet)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}