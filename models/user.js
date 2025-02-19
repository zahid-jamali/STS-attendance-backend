const mongoose=require("mongoose");

const schema=mongoose.Schema({
	Name:{
		required: true,
		type: String,
	},
	Email: {
		type: String,
		required: true,
	},
	Phone: {
		type: String,
		required: true,
	},
	Bio:{
		type: String,
		default:"No bio written",
	},
	roll:{
		type: String,
		required: true,
	},
	is_Active:{
		type: Boolean,
		default: false,
	},
	is_Admin:{
		type: Boolean,
		default: false,
	},
	Password: {
		type: String,
		required: true,
		default: "$2b$10$7OP/lAMs3xMzjFkxMlQEAePht.gx6DKQ996nLGD8SAkv8FcMP5nK6"
	},

});

const User=mongoose.model("User", schema);
module.exports=User;