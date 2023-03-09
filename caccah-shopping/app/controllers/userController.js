//=================== Model Schema Link =================//

const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const Seller = require("../models/Seller");

//================== Dependencies =====================//

const auth = require("../auth");
const bcrypt = require("bcrypt");

//==================== Modules ======================//

module.exports.registerUser = (reqBody) => {
	return User.find({email: reqBody.email, mobileNumber: reqBody.mobileNumber}).then(result => {
		if(!result){
			let newUser = new User({
			firstName: reqBody.firstName,
			lastName: reqBody.lastName,
			email: reqBody.email,
			password: bcrypt.hashSync(reqBody.password, 10),
			mobileNumber: reqBody.mobileNumber
			});
			return newUser.save().then(user => res.status(201).send("registered sucessfully"))
		} else {
			res.status(400).send("email and mobileNumber is currently in use")
		}
	}).catch(err => err);
	
}

//================ End of Modules ==================//