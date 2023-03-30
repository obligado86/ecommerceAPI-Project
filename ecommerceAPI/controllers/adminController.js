//=================== Model Schema Link =================//

const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

//================== Dependencies =====================//

const auth = require("../auth");
const bcrypt = require("bcrypt");

//==================== Modules ======================//

// retrieve user details

module.exports.getUserDetails = (reqParams) => {
	return User.findById(reqParams.userId).then(result => {
		result.password = "";
		return result;
	}).catch(err => err);
}

// retrive all orders

module.exports.getUserOrder = () => {
	return Order.find({}).then(result => {
		return result;
	})
}

// add products 

module.exports.addProduct = (reqBody) => {
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
	return newProduct.save().then(product => true).catch(err => false);
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
	return Product.findByIdAndUpdate(reqParams.productId, updateInfo).then(update => update).catch(err => err);
};

//confirm order 

module.exports.confirmPayment = (reqParams) => {
	let confirmmation = {
		status: "processsing"
	};
	return Order.findByIdAndUpdate(reqParams.orderId, confirmmation).catch(err => err)
};

//confirm order cancel

module.exports.confirmCancel = (reqParams) => {
	let confirmmation = {
		status: "canceled"
	};
	return Order.findByIdAndUpdate(reqParams.orderId, confirmmation).catch(err => err)
};

// archive product 

module.exports.archiveProduct = (reqParams) => {
	let archiveProduct = {
		isActive: false
	};
	return Product.findById(reqParams.productId).then(product => {
		if(!product.isActive){
			return false;
		} else {
			return Product.findByIdAndUpdate(reqParams.productId, archiveProduct).then(productUpdate => productUpdate).catch(err => err);
		}
	})
};

// reactivaed product 

module.exports.reactivateProduct = (reqParams) => {
	let activateProduct = {
		isActive: true
	};
	return Product.findById(reqParams.productId).then(product => {
		if(product.isActive){
			return false;
		} else {
			return Product.findByIdAndUpdate(reqParams.productId, activateProduct).then(productUpdate => productUpdate).catch(err => err);
		}
	})
};

//================ End of Modules ==================//