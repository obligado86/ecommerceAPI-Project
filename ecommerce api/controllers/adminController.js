//=================== Model Schema Link =================//

const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

//================== Dependencies =====================//

const auth = require("../auth");
const bcrypt = require("bcrypt");

//==================== Modules ======================//

// retrieve user details

module.exports.getUserDetails = (user) => {
	return User.findById(user.userid).then(result => {
		result.password = "";
		return result;
	}).catch(err => err);
}

// retrive all orders

module.exports.getUserOrder = (user) => {
	return User.findById(user.userid).then(result => {
		return result.orders;
	})
}

// add products 

module.exports.addProduct = (reqParams, reqBody) => {
	const newProduct = new Product({
		name: reqBody.name,
		description: reqBody.description,
		images: [{
			image: reqBody.image
		}],
		category: reqBody.category,
		brand: reqBody.brand,
		stock: reqBody.stock,
		price: reqBody.price
	});
	return newProduct.save().then(product => {

	}).catch(err => err);
};

// update product info

module.exports.updateProduct = (reqParams, reqBody) => {
	const updateInfo = {
		name: reqBody.name,
		description: reqBody.description,
		images: [{
			image: reqBody.image
		}],
		category: reqBody.category,
		brand: reqBody.brand,
		stock: reqBody.stock,
		price: reqBody.price
	};
	return Product.findByIdAndUpdate(reqParams.productId, updateInfo).then(update => true).catch(err => err);
};


//================ End of Modules ==================//