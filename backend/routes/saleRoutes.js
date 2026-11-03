const router=require("express").Router();
const {protect,allowRoles}=require("../middleware/auth");
const {createSale,getSales,getSale}=require("../controllers/saleController")

router.post("/",protect, allowRoles("admin","pharmacist"), createSale);
router.get("/",protect, allowRoles("admin","pharmacist"), getSales);
router.get("/:id",protect, allowRoles("admin","pharmacist"), getSale);

module.exports=router;
