const mongoose=require("mongoose");

const conn=()=>{
	let url=process.env.MONGODB_URL;
	return mongoose.connect(url).then(console.log("Database connected!"));
}
//zahidjamali4848-taoZZF5ePpDF1HF0
module.exports=conn;
