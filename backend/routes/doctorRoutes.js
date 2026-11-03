const router=require("express").Router();
const {protect, allowRoles}=require("../middleware/auth")
const {
    createProfile, updateMyProfile, getDoctors, getDoctor, getAvailableSlots
}=require("../controllers/doctorController");

router.get("/", protect, getDoctors);
router.post("/", protect, allowRoles("doctor"),createProfile);
router.put("/me", protect, allowRoles("doctor"), updateMyProfile)

router.get("/:id/slots", protect, getAvailableSlots);
router.get("/:id", protect, getDoctor);

module.exports=(router);