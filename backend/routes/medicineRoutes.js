const router=require("express").Router()
const {protect,allowRoles}=require("../middleware/auth")
const {
  addMedicine, getMedicines, getMedicine,
  updateMedicine, deleteMedicine, getLowStock,
} = require("../controllers/medicineController");

// Anyone who is login will be abble to see it
router.get("/",protect,getMedicines);

// Only show  Admin and Pharmasist  ---------------->
router.get("/low-stock",protect,allowRoles("admin","pharmacist"),getLowStock)
router.post("/",protect,allowRoles("admin","pharmacist"),addMedicine);
router.put("/:id",protect,allowRoles("admin","pharmacist"), updateMedicine);
router.delete("/:id",protect,allowRoles("admin"),deleteMedicine);

router.get("/:id",protect,getMedicine)
module.exports=router;
