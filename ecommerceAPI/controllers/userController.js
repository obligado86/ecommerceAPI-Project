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
		if(!product.isActive && product.stock <= 0 && product.stock < reqQuantity.quantity){
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
	return User.findById(reqParams.userId).then((user) => {
		const itemIndex = user.cart.findIndex((item) => item.productId.toString() === reqBody.productId);
		if(itemIndex >= 0){
				user.cart.splice(itemIndex, 1);
				return user.save().then(() => true);
			} else {
				return false;
			}
	}).catch(err => console.log(err));
};

// user Checkout

module.exports.checkOut = (reqParams, reqBody) => {
	const shippingAddress = {
			houseNoUnitNo: reqBody.houseNoUnitNo,
			street: reqBody.street,
			town: reqBody.town,
			city: reqBody.city,
			region: reqBody.region,
			zipCode: reqBody.zipCode
		}
	const userId = reqParams.userId;
	return User.findById(userId).then((user) => {
		if(!user.cart){
			return false;
		} else {
			const userCart = user.cart;
			let totalItemPrice = 0;
			for(let i = 0; i < userCart.length; i++) {
				const item = userCart[i];
				totalItemPrice += item.price * item.quantity;
				return Product.findById(item.productId).then((itemProduct) => {
					if(!itemProduct.isActive && itemProduct.stock < item.quantity){
						return false;
					} else {
						const newstock = (itemProduct.stock - item.quantity);
						const newOrder = new Order({
							userId: userId,
							products: [{
								productId: item.productId,
								productName: item.productName,
								productPrice: item.price,
								quantity: item.quantity
							}],
							totalAmount: totalItemPrice
						});
						itemProduct.stock = newstock;
						return itemProduct.save() && newOrder.save().then((order) => {
							const userOrder = {
								orderId: order._id,
								products: [{
									productId: order.products[0].productId,
									productName: order.products[0].productName,
									productPrice: order.products[0].productPrice,
									quantity: order.products[0].quantity
								}],
								totalAmount: order.totalAmount
							};
							if(user.address.length < 0 && !user.address.includes(shippingAddress)){
								user.address.push(shippingAddress);
								user.orders.push(userOrder);
							} else {
								user.orders.push(userOrder);
							}
							user.cart = [];
							return user.save().then(() => true)
						})
					}
				}).catch(err => console.log(err))
			}
				
		}
	})
}

// set user as admin

module.exports.setAsAdmin = (reqParams) => {
	let setAdmin = {isAdmin: true};
	return User.findByIdAndUpdate(reqParams.userId, setAdmin).then(update => true).catch(err => err);
};


//================ End of Modules ==================//