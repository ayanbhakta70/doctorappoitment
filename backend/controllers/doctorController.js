const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment")

// Doctor Create her personal profile ------->
exports.createProfile = async (req, res) => {
    try {
        const exists = await Doctor.findOne({ user: req.user.id });
        if (exists) return res.status(400).json({ message: "Profile Already exit" });

        const doctor = await Doctor.create({ ...req.body, user: req.user.id });
        res.status(201).json(doctor)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Doctor Profile Update ---------------->>
exports.updateMyProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate({ user: req.user.id }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doctor) return res.status(404).json({ message: "Profile Not found" });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// All Doctor (?specialization=heart)-------------------->
exports.getDoctors = async (req, res) => {
    try {
        const { specialization } = req.query;
        const filter = specialization
            ? { specialization: { $regex: specialization, $options: "i" } }
            : {};
        const doctors = await Doctor.find(filter).populate("user", "name email");
        res.json(doctors)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// One doctor ------------------>
exports.getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate("user", "name email");
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        res.json(doctor)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Available Slots on a Specific Date ----------->
exports.getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;
        const doctor = await Doctor.findById(req.params.id)
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        const booked = await Appointment.find({
            doctor: doctor.id,
            date,
            status: { $ne: "cancelled" },
        })

        const bookedSlots = booked.map((a) => a.timeSlot)
        const free = doctor.timeSlots.filter((s) => !bookedSlots.includes(s));

        res.json({ date, getAvailableSlots: free });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
