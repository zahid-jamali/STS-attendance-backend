const express=require("express");
const cors=require("cors");
const userRoutes=require("./routes/userRoutes.js");
const attendanceRoutes=require("./routes/attendanceRoutes.js");
const projectRoutes=require("./routes/projectRoutes.js");
const complainRoutes=require("./routes/complainRoutes")
const leaveRoutes=require("./routes/leaveRoutes");
const holidaysRoutes=require("./routes/holidaysRoutes");
const conn=require("./conn.js");


conn();

const app=express();
app.use(express.json());
app.use(cors());

app.use(userRoutes);
app.use(attendanceRoutes);
app.use(projectRoutes);
app.use(complainRoutes);
app.use(leaveRoutes);
app.use(holidaysRoutes)

app.get("/health", (req, res,)=>{
	res.status(200).json({message:"Server is running"})
})

console.log("Server is running...");
app.listen(2222);

