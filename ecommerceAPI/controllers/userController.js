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
	const productId = reqParams.productId;
	return Product.findById(productId).then(result => result).catch(err => err);
}

// see all active products

module.exports.browseAllProduct = () => {
	return Product.find({isActive: true}).then(result => result).catch(err => err);
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

module.exports.addProductCart = (user, reqParams, reqBody) => {
	const reqQuantity = {quantity: reqBody.quantity}
	return Product.findById(reqParams.productId).then(product => {
		const productInfo = {
			productId: product._id,
			productName: product.name,
			quantity: reqQuantity.quantity,
			price: product.price
		};
		if(!product.isActive){
			return false;
		} else {
			return User.findById(user.userId).then(user => {
				const cartIndex = user.cart.findIndex(
					(cartProduct) => cartProduct.productId.toString() === reqParams.productId
				);
				if(cartIndex >= 0){
					user.cart[cartIndex].quantity += reqQuantity.quantity;
				} else {
					user.cart.push(productInfo);
				}

				return user.save().then(() => true);
			})
		}
	}).catch(err => err);
};

// view cart items

module.exports.viewCart = (reqParams) => {
	return User.findById(reqParams.userId).then(user => {
		return user.cart;
	}).catch(err => err);
};

// delete items from cart

module.exports.deleteCartItem = (reqParams, reqBody) => {
	const reqProductId = {id: reqBody.id}
	console.log(reqParams.userId)
	return User.findById(reqParams.userId).then(user => {
		if(!user){
			return false;
		} else {
			const itemIndex = user.cart.findIndex((product) => productId.toString() === reqProductId.id);
			if(itemIndex === -1){
				throw new Error("product not found in your cart");
			}
			const removeProduct = user.cart.splice(itemIndex, 1);
			return user.save().then(() => removeProduct);
		}
	}).catch(err => err);
};

// user Checkout

module.exports.checkOut = async (reqParams, reqBody) => {
	try {
		const shippinAddress = {
			houseNoUnitNo: reqBody.houseNoUnitNo,
			street: reqBody.street,
			town: reqBody.town,
			city: reqBody.city,
			region: reqBody.region,
			zipCode: reqBody.zipCode
		}
		const userId = reqParams.userId;
		const user = await User.findById(userId);
		if(!user.cart) {
			return false;
		} else {
			const userCart = user.cart;
			let totalItemPrice = 0;
			const userOrder = [];

			for(let i = 0; i < userCart.length; i++) {
				const item = userCart[i];
				totalItemPrice += (item.Price * item.quantity);
				const itemProduct = await Product.findById(item.productId);
				if(!itemProduct.isActive){
					return false;
				} else {
				const newstock = (itemProduct.stock - item.quantity);
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
				await newOrder.save().then(order => true).catch(err => err);
				const userOrder = {
					orderId: saveOrder._id,
					products: [{
						productId: saveOrder.products[0].productId,
						productName: saveOrder.products[0].productName,
						productPrice: saveOrder.products[0].price,
						quantity: saveOrder.products[0].quantity
					}],
					totalAmount: saveOrder.total
				};
				userOrders.push(userOrder);
				const stockupdate = {stocks: newstock}
				await Product.findByIdAndUpdate(item.productId, stockupdate);
			}
		};
		if(!user.address){
			user.address.push(shippinAddress);
			user.orders.push(userOrder);
		} else {
			user.orders.push(userOrder);
		}
		user.cart = [];
		await user.save().then(savedUser => savedUser)
		}	
	} catch(Error){
		console.log(Error);
		return Error;
	}

};

// set user as admin

module.exports.setAsAdmin = (reqParams) => {
	let setAdmin = {isAdmin: true};
	return User.findByIdAndUpdate(reqParams.userId, setAdmin).then(update => true).catch(err => err);
};


//================ End of Modules ==================//