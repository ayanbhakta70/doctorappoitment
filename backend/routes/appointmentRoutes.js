const router=require("express").Router();
const {protect, allowRoles}=require("../middleware/auth")
const { 
    bookAppointment, myAppointments, doctorAppointments, updateStatus, cancleAppointment 
} = require("../controllers/appointmentController");

router.post("/",protect, allowRoles("patient"), bookAppointment);
router.get("/my", protect, allowRoles("patient"), myAppointments);
router.get("/doctor", protect, allowRoles("doctor"),doctorAppointments);
router.put("/:id/status", protect, allowRoles("doctor","admin"), updateStatus);
router.param("/:id/cancle", protect, allowRoles("patient"), cancleAppointment);

module.exports=router;