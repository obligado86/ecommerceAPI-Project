//=================== Model Schema Link =================//

const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

//================== Dependencies =====================//

const auth = require("../auth");
const bcrypt = require("bcrypt");

//==================== Modules ======================//

// register user

module.exports.registerUser = (reqBody) => {
	return User.findOne({email: reqBody.email}).then(result => {
		if(!result){
			let newUser = new User({
			firstName: reqBody.firstName,
			lastName: reqBody.lastName,
			email: reqBody.email,
			password: bcrypt.hashSync(reqBody.password, 10),
			mobileNumber: reqBody.mobileNumber,
			cart: [],
			orders: []
			});
			return newUser.save().then(user => true);
		} else {
			false;
		}
	}).catch(err => err);
};

// login user

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

// see single product

module.exports.viewProduct = (reqParams) => {
	const productId = reqParams.id;
	return Product.findById(productId).then(result => {
		return result;
	}).catch(err => err);
}

// see all active products

module.exports.browseAllProduct = () => {
	return Product.find({}).then(products => {
		if(products.isActive){
			return products;
		}
	}).catch(err => err);
};

// view user orders

module.exports.viewOrders = (user) => {
	return User.findById(user.id).then(result => {
		if(!result.orders){
			return false;
		} else {
			return Order.findById(result.orders._id).then(items => {
				return items;
			}).catch(err => err)
		}
	}).catch(err => err);
}

// add Product to cart

module.exports.addProductCart = (reqParams, reqBody) => {
	return Product.findById(reqBody).then(product => {
		const productInfo = {
			productId: reqBody.id,
			productName: product.name,
			quantity: reqBody.quantity,
			price: product.price
		}
		if(!product.isActive){
			return false;
		} else {
			return User.findById(reqParams.id).then(result => {
				result.cart.push(productInfo)
				return result.save().then(added => true);
			})
		}
	}).catch(err => err)
}

// view cart items

module.exports.viewCart = (reqParams) => {
	return User.findById(reqParams.id).then(user => {
		return user.cart;
	}).catch(err => err);
};

// user Checkout

module.exports.checkOut = async (reqParams, reqBody) => {
	const { shippinAddress } = reqBody;
	const userId = reqParams.id;
	const user = await User.findById(userId);
	if(!user.cart) {
		return false;
	} else {
		const userCart = user.cart;
		let totalItemPrice = 0;

		for(let i = 0; i < userCart.length; i++) {
			const item = userCart[i];
			totalItemPrice += (item.Price * item.quantity);
			const newOrder = new Order({
				user: userId,
				products: [{
					productId: item.productId,
					productName: item.productName,
					quantity: item.quantity,
					price: item.price
				}],
				total: totalItemPrice
			});
			const saveOrder = await newOrder.save();
			const userOrder = await {
				orderId: saveOrder._id,
				products: [{
					productId: saveOrder.productId,
					productName: saveOrder.productName,
					productPrice: saveOrder.price,
					quantity: saveOrder.quantity
				}],
				totalAmount: saveOrder.total
			}
		};
		if(!user.address){
			user.address.push(shippinAddress);
			user.orders.push(userOrder);
		} else {
			user.orders.push(userOrder);
		}
		user.cart = [];
		await user.save().then(saved => true).catch(err => err);
	}

}

// set user as admin

module.exports.setAsAdmin = (user) => {
	const setAdmin = { 
		isAdmin: true,
		products: []
	}
	return User.findByIdAndUpdate(user.id, setAdmin).then(result => true).catch(err => err);
}


//================ End of Modules ==================//