const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
require("dotenv").config()

const app=express()
app.use(express.json())
app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/medicines",require("./routes/medicineRoutes"));
app.use("/api/sales",require("./routes/saleRoutes"));
app.use("/api/doctors",require("./routes/doctorRoutes"));
app.use("/api/appointments",require("./routes/appointmentRoutes"));

app.get("/",(req,res)=>{
    res.send("Medicare App Api starting")
})

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("MongoDB connected")
    app.listen(process.env.PORT, ()=>{
        console.log(`Server is runing port ${process.env.PORT}`);        
    })
})
.catch((err)=>console.log(err))