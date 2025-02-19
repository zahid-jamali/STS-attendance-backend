const mongoose=require("mongoose");

const conn=()=>{
	return mongoose.connect("mongodb+srv://zahidjamali4848:taoZZF5ePpDF1HF0@sts-attendance.y6trb.mongodb.net/STS-attendance").then(console.log("Database connected!"));
}
module.exports=conn;