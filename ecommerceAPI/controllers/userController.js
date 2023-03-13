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
			return user.save().then(() => true);
		}
	}).catch(err => err);
};

// user Checkout

module.exports.checkOut = async (reqParams, reqBody) => {
	const shippinAddress = {
			houseNoUnitNo: reqBody.houseNoUnitNo,
			street: reqBody.street,
			town: reqBody.town,
			city: reqBody.city,
			region: reqBody.region,
			zipCode: reqBody.zipCode
		}
	const userId = reqParams.userId;
	let userOrder = []

	try {
	const isOrderCreated = await User.findById(userId).then(user => {
		const userCart = user.cart;
		if(!userCart.length){
			return false;
		} else {
			let totalItemPrice = 0;
			for(let i = 0; i < userCart.length; i++){
				let item = userCart[i];
				totalItemPrice += (item.Price * item.quantity);
				const orderCreation = await Product.findById(item.productId._id).then(itemProduct => {
					if(!itemProduct.isActive){
						return false;
					} else {
						const newStock = (itemProduct.stock - item.quantity);
						const stockUpdate = {stocks: newstock}
						const stockUpdate = itemProduct
						let newOrder = new Order([
							user: userId,
							products: [{
								productId: item.productId._id,
								productName: item.productName,
								quantity: item.quantity,
								price: item.price
							}],
							total: totalItemPrice
						]);
						return newOrder.save().then(order => {
							for(let j = 0; j < order.products.length; j++){
							const userOrder = {
								orderId: order._id,
								products: [{
									productId: order.products[j].productId,
									productName: order.products[j].productName,
									productPrice: order.products[j].price,
									quantity: order.products[j].quantity
								}],
								totalAmount: order.total
								};
							}
							userOrders.push(userOrder);
							return order.save().then(order => true)
						});
						const productStockUpdate = await Product.findByIdAndUpdate(item.productId._id, stockUpdate).then(itemProduct => true)
					}

				})
			}
			if(!user.address.length && user.address !== shippinAddress){
				address.push(shippinAddress);
				user.orders.push(userOrder);
			} else {
			user.orders.push(userOrder);
			}
			user.cart = [];
			return user.save().then(user => true);
		}
	})	
}

// set user as admin

module.exports.setAsAdmin = (reqParams) => {
	let setAdmin = {isAdmin: true};
	return User.findByIdAndUpdate(reqParams.userId, setAdmin).then(update => true).catch(err => err);
};


//================ End of Modules ==================//