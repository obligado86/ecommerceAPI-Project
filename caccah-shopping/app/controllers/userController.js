//=================== Model Schema Link =================//

const User = require("../models/User");
const Order = require("../models/Order");
const Seller = require("../models/Seller");

//================== Dependencies =====================//

const auth = require("../auth");
const bcrypt = require("bcrypt");

//==================== Modules ======================//

module.exports.registerUser = (reqBody) => {
	return User.findOne({email: reqBody.email}).then(result => {
		if(!result){
			let newUser = new User({
			firstName: reqBody.firstName,
			lastName: reqBody.lastName,
			email: reqBody.email,
			password: bcrypt.hashSync(reqBody.password, 10),
			mobileNumber: reqBody.mobileNumber
			});
			return newUser.save().then(user => true);
		} else {
			false;
		}
	}).catch(err => err);
	
}

module.exports.loginUser = (reqBody) => {
	return User.findOne({email: reqBody.email}).then(result => {
		if(!result){
			return false;
		} else {
			const passwordValiditation = bcrypt.compareSync(reqBody.password, result.password);
			if(passwordValiditation){
				return {access: auth.createAccessToken(result)}
			} else {
				return false;
			}
		}
	}).catch(err => err);
};

module.exports.registerAsSeller = (reqParams, reqBody) => {
	return Seller.findOne({storeName: reqBody.storeName}).then(result => {
		if(!result){
			let newSeller = new Seller({
				storeName: reqBody.storeName,
				storeDescription: reqBody.storeDescription,
				storeAddress: [{
					houseNoUnitNo: reqBody.houseNoUnitNo,
					street: reqBody.street,
					town: reqBody.town,
					city: reqBody.city,
					region: reqBody.region,
					zipCode: reqBody.zipCode
				}]
			});
			let updateSeller = {
				isSeller: true
			}
			return newSeller.save() && User.findByIdAndUpdate(reqParams.userId, updateSeller).then(result => true).catch(err => err);
		} else {
			return false;
		}
	});
};

//================ End of Modules ==================//