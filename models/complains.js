const mongoose=require("mongoose");

const schema=mongoose.Schema({
	user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    Title:{
    	type:String,
    	required:true,
    },
    Description:{
    	type:String,
    	required:true
    },
    createDate:{
    	type:Date,
    	default:Date.now,
    },
    readDate:{
    	type:Date,
    },
    Status:{
    	type:Boolean,
    	default:false,
    }


});

const Complain=mongoose.model("Complain", schema);
module.exports = Complain;