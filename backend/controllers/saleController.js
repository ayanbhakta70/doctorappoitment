const sale =require("../models/Sale")
const Medicine=require("../models/Medicine");
const Sale = require("../models/Sale");
const { json } = require("express");

// new sales and bill making
exports.createSale=async(req,res)=>{
    const {customerName, items}=req.body;
    const done=[];     // Those for which stock has decreased(to be returned, if necessary)
    try {
        if(!items || items.length ===0)
            return res.status(400).json({message:"No Medicine Sold"});
        const saleItems=[];
        let totalAmount=0;

        for(const item of items){
            // if stock available and validity available then decreased medicine stock (At a time chack + update)
            const medicine=await Medicine.findOneAndUpdate(
                {
                    _id:item.medicine,
                    quantity:{$gte:item.quantity},
                    expireDate:{ $gt:new Date()},
                },
                {$inc:{quantity: -item.quantity}},
                {new:true}
            );

            if(!medicine){
                for(const d of done){
                    await Medicine.findByIdAndUpdate(d.medicine,{
                        $ins:{quantity:d.quantity},
                    });
                }
                return res.status(400).json({
                    message:"stock not available, expireDate over or medicine not available",
                })
            }
            done.push({medicine: medicine._id, quantity: item.quantity})
            saleItems.push({
                medicine: medicine._id,
                name: medicine.name,
                price: medicine.price,
                quantity: item.quantity,
            })
            totalAmount+=medicine.price * item.quantity;            
        }

        const sale = await Sale.create({
            customerName,
            items: saleItems,
            totalAmount,
            soldBy: req.user.id,
        });
        res.status(201).json(sale)
    } catch (error) {
        res.status(500).json({message: error.message})        
    }
}

// all sale bill list-------->
exports.getSales=async (req,res)=>{
    try {
        const sales=await Sale.find()
            .populate("soldBy","name role")
            .sort({createdAt: -1})
            res.json(sales)            
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// One bill ---------------->
exports.getSale=async(req,res)=>{
    try {
        const sale=await Sale.findById(req.params.id).populate("soldBy","name")
        if(!sale) return res.status(404).json({message:"Bill not found"});
        res.json(sale)            
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}