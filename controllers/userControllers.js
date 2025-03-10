const User=require("../models/user.js");
const bcrypt=require("bcrypt");



const getAllUsers=async (req, res, next)=>{
	try{
		const users=await User.find({is_Active:true});
		res.status(200).send(users);
	}catch(e){
		console.error(e);
		return res.status(500).json({message:"Internal server error"})
	}
}



const getTotalUsers=async (req, res, next)=>{
    try{
        const users=await User.find();
        res.status(200).send(users);
    }catch(e){
        console.error(e);
        return res.status(500).json({message:"Internal server error"})
    }
}


const updateUser = async (req, res, next) => {
    try {
        const { userId, name, email, phone, bio, newPassword, oldPassword, admin, is_admin, is_active } = req.body;

        // Check if user exists
        const usr = await User.findById(userId);
        if (!usr) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Update user fields if provided
        if (name) usr.Name = name;
        if (email) usr.Email = email;
        if (phone) usr.Phone = phone;
        if (bio) usr.Bio = bio;

        // Handle password update
        if (newPassword && oldPassword) {
            const isMatch = await bcrypt.compare(oldPassword, usr.Password);
            if (!isMatch) {
                return res.status(400).json({ message: "Old Password does not match!" });
            }
            usr.Password = await bcrypt.hash(newPassword, 10);
        }else if(admin){
            usr.is_Admin=is_admin;
            usr.is_Active=is_active;
            usr.Password = await bcrypt.hash(newPassword, 10);
        }

        // Save updated user data
        await usr.save();
        res.status(200).json({ message: "User updated successfully!" });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const createUser = async (req, res) => {
  try {
    const { name, email, phone, bio, roll, is_active, is_admin, password } = req.body;
    const existingUser = await User.findOne({ Email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    let hashedPassword=await bcrypt.hash(password, 10)

    const usr = new User({Name:name, Email: email, Phone: phone, Bio: bio, roll: roll, is_Active: is_active, is_Admin: is_admin, Password: hashedPassword });

    await usr.save();
    console.log("User created: ", email);
    return res.status(201).json({ message: "User created successfully!" });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error!" });
  }
};





const login=async (req, res, next)=>{
	const {email, password}=req.body;
    console.log(req.body);
	console.log("Login Request!");
	const usr=await User.findOne({Email:email.toLowerCase()});

	if(!usr){
		return res.status(400).send({msg:"Login Failed!"});
	}
	const isMatch=await bcrypt.compare(password, usr.Password) && usr.is_Active ;
	if(isMatch){
		console.log("Successfully login ", email)
		return res.status(200).send({msg:"Successfully logged in", usr});
		
	}
	else{
		console.log("Login Request Failed ", email)
		return res.status(400).send({msg:"Login Failed!"});
	}

}

module.exports={login, createUser, getAllUsers, updateUser, getTotalUsers};