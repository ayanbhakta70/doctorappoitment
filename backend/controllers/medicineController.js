const Medicine=require("../models/Medicine");


// add medicine ------------>>>
exports.addMedicine=async(req,res)=>{
    try {
        const medicine=await Medicine.create(req.body);
        res.status(201).json(medicine);        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
};

// Search Medicine---------->
exports.getMedicines = async (req, res) => {   
    try {
        const { search } = req.query;
        const filter = search
            ? { name: { $regex: search, $options: "i" } }
            : {};
        const medicines = await Medicine.find(filter).sort({ createdAt: -1 });
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// search one Medicine--------------------->
exports.getMedicine=async (req,res)=>{
    try {
        const medicine=await Medicine.findById(req.params.id);
        if(!medicine)return res.status(404).json({message:"Medicine not found"});
        res.json(medicine)            
    } catch (error) {
        res.status(500).json({message:error.message})
    }
};

// Update Medicine ------------------>

exports.updateMedicine = async (req,res)=>{
    try {
        const medicine=await Medicine.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!medicine) return res.status(404).json({message:"Medicine not found"});
        res.json(medicine)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
};

// delete Medicine------------------->
exports.deleteMedicine=async(req,res)=>{
    try {
        const medicine=await Medicine.findByIdAndDelete(req.params.id);
        if(!medicine) return res.status(404).json({message:"Medicine not found"});
        res.json({message:"Medicine successfully delete"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// find not enough medicine -------------------->>
exports.getLowStock=async(req,res)=>{
    try {
        const medicines=await Medicine.find({
            $expr: {$lte:["$quantity","$lowStockLimit"]}            
        })
        res.json(medicines)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
