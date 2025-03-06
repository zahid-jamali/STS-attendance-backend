const mongoose=require("mongoose");

const conn=()=>{
	let url="mongodb+srv://zahidjamali4848:taoZZF5ePpDF1HF0@sts-attendance.y6trb.mongodb.net/STS-attendance"
	return mongoose.connect(url).then(console.log("Database connected!"));
}
module.exports=conn;