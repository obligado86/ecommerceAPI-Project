//=================== Model Schema Link =================//

const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Seller = require("../models/Seller");

//================== Dependencies =====================//

const auth = require("../auth");
const bcrypt = require("bcrypt");

//==================== Modules ======================//

module.exports.updateStoreName = (reqParams, reqBody) => {
	const productId = reqParams;
	const updateName = {storeName: reqBody.storeName};
	const findQuery = {storeName: {$regex: reqBody.storeName, $options: '$i'}};
	return Seller.findOne(findQuery).then(result => {
		if(!result){
			return Seller.findByIdAndUpdate(productId, updateName).then(save => save).catch(err => err);
		} else {
			return false;
		}
	})
};

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
		price: reqBody.price,
		seller: productId
	});
	return Seller.findById(productId).then(result => {
		if(!result){
			return false;
		} else {
			result.products.push(newProduct);
			return Promise.all([result.save(), newProduct.save()]);
		}
	}).then(([resultSave, productSave]) => {
		return true;
	}).catch(err => err);
}

//================ End of Modules ==================//