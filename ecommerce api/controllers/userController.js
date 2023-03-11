//=================== Model Schema Link =================//

const User = require("../models/User");
const Order = require("../models/Order");
const Seller = require("../models/Seller");
const Product = require("../models/Product");

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
			mobileNumber: reqBody.mobileNumber,
			cart: []
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

/*module.exports.registerAsSeller = (reqParams, reqBody) => {
	const findQuery = {storeName: {$regex: reqBody.storeName, $options: '$i'}}
	return Seller.findOne(findQuery).then(result => {
		if(!result){
			let newSeller = new Seller({
				user: reqParams.userId,
				storeName: reqBody.storeName,
				storeDescription: reqBody.storeDescription,
				storeAddress: [{
					houseNoUnitNo: reqBody.houseNoUnitNo,
					street: reqBody.street,
					town: reqBody.town,
					city: reqBody.city,
					region: reqBody.region,
					zipCode: reqBody.zipCode
				}],
				products: []
			});
			let updateUser = {
				isSeller: true,
				seller: newSeller
			}
			return User.findByIdAndUpdate(reqParams.userId, updateUser).then(update => update).catch(err => err) && newSeller.save().then(saved => true).catch(err => err);
		} else {
			return false;
		}
	});
};*/

module.exports.browseAllProduct = () => {
	return Product.find({}).then(result => {
		return result;
	}).catch(err => err);
};

module.exports.addProductCart = (reqParams, reqBody) => {
	return Product.findById(reqBody).then(product => {
		console.log(product.isActive);
		if(!product.isActive){
			return false;
		} else {
			return User.findById(reqParams).then(result => {
				result.cart.push({product})
				return result.save().then(added => true);
			})
		}
	}).catch(err => err)
}

module.exports.checkOut = async (reqParams, reqBody) => {
	const { shippinAddress } = reqBody;
	const userId = reqParams;
	const user = await User.findById(userId);
	if(!user.cart) {
		return false;
	} else {
		const userCart = user.cart;
		let totalItemPrice = 0;
		let orders = [];

		for(let i = 0; i < userCart.length; i++) {
			const item = userCart[i];
			totalItemPrice += item.Price;
			const newOrder = new Order({
				user: userId,
				products: [{
					product: item._id,
					quantity: 1,
					price: items.price
				}],
				total: totalItemPrice
			});
			const saveOrder = await newOrder.save();
			orders.push(saveOrder);
		};
		if(!user.address){
			user.address.push(shippinAddress);
			user.orders.push(...orders);
		} else {
			user.order.push(...orders);
		}
		user.cart = [];
		await user.save().then(saved => true).catch(err => err);
	}
}


//================ End of Modules ==================//