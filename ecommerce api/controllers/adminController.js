//=================== Model Schema Link =================//

const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Admin = require("../models/Admin");

//================== Dependencies =====================//

const auth = require("../auth");
const bcrypt = require("bcrypt");

//==================== Modules ======================//

// retrieve user details

module.exports.getUserDetails = () => {
	return User.find({}).then(result => {
		return result;
	}).catch(err => err);
}

// add products 

module.exports.addProduct = (reqParams, reqBody) => {
	const productId = reqParams;
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
	return Admin.findById(productId).then(result => {
		result.products.push(newProduct);
		return Promise.all([result.save(), newProduct.save()]);
	}).then(([resultSave, productSave]) => {
		return true;
	}).catch(err => err);
};




//================ End of Modules ==================//