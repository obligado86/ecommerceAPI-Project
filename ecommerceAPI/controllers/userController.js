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



// get user details
module.exports.getProfile = (data) => {
	return User.findById(data.userId).then(result => {

		result.password = "";
		return result;
	}).catch(err => err);
}

//user profile

module.exports.userProfile = (reqParams) => {
	return User.findById(reqParams.userId).then(user => {
		user.password = ""
		return user
	})
}

// see user orders
module.exports.seeUserOrder = (reqParams) => {
	return User.findById(reqParams.userId).then(user => {
		return user.orders
	}).catch(err => console.log(err))
} 

// see single product

module.exports.viewProduct = (reqParams) => {
	const productId = reqParams.productId;
	return Product.findById(productId).then(result => result).catch(err => err);
}

// see all active products

module.exports.browseAllProduct = () => {
	return Product.find({isActive: true}).then(result => result).catch(err => err);
};

module.exports.allInactiveProduct = () => {
	return Product.find({isActive: false}).then(result => result).catch(err => err);
};

//search by category

module.exports.browseByCategory = (reqBody) => {
	return Product.find({isActive: true, category: reqBody.category}).then(result => result).catch(err => err);
};

//search by name

module.exports.search = (reqBody) => {
	return Product.find({isActive: true, name: reqBody.name}).then(result => result).catch(err => err);
};

//user address

module.exports.findAddress = (reqParams) => {
	return User.findById(reqParams.userId).then(user => {
		if (user.address.length >= 0){
			return user.address[0]
		} else {
			return false
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

//view Products on order

module.exports.seeProductsOrders = (reqParams) => {
	return User.findById(reqParams.userId).then(user => {
		return user.orders[0].products
	}).catch(err => console.log(err));
}

// add Product to cart

module.exports.addProductCart = (data, reqParams, reqBody) => {
	const reqQuantity = {quantity: reqBody.quantity}
	return Product.findById(reqParams.productId).then(product => {
		const productImg = product.images[0].image
		const productInfo = {
			productImage: productImg,
			productId: product._id,
			productName: product.name,
			quantity: reqQuantity.quantity,
			price: product.price
		};
		if(!product.isActive && product.stock === 0 && product.stock < reqQuantity.quantity){
			return false;
		} else {
			return User.findById(data.userId).then(user => {
				const cartIndex = user.cart.findIndex(
					(cartProduct) => cartProduct.productId.toString() === reqParams.productId
				);
				if(cartIndex >= 0){
					user.cart[cartIndex].quantity += reqQuantity.quantity;
				} else {
					user.cart.push(productInfo);
				}

				return user.save().then(() => productInfo);
			})
		}
	}).catch(err => console.log(err));
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
    const paymentType = { paymentMethod: reqBody.paymentMethod }
    const userId = reqParams.userId;
    return User.findById(userId).then((user) => {
        if (!user.cart || user.cart.length === 0) {
            return false;
        } else {
            let totalItemPrice = 0;
            let allItemcost = 0
            let shippingCost = 0
            const totalShipping = (user.cart.length + 1) * 120
            const promises = user.cart.map((item) => {
                return Product.findById(item.productId).then((itemProduct) => {
                    if (!itemProduct.isActive || itemProduct.stock === 0 || itemProduct.stock < item.quantity) {
                        return false;
                    } else {
                        allItemcost += item.price * item.quantity;
                        if (allItemcost >= 1000) {
                            totalItemPrice = allItemcost
                        } else {
                            totalItemPrice = allItemcost + totalShipping
                            shippingCost = totalShipping
                        }
                        const newstock = (itemProduct.stock - item.quantity);
                        const newOrder = new Order({
                            userId: userId,
                            products: [{
                                productId: item.productId,
                                productImage: item.productImage,
                                productName: item.productName,
                                productPrice: item.price,
                                quantity: item.quantity
                            }],
                            shippingCost: shippingCost,
                            totalAmount: totalItemPrice,
                            paymentMethod: paymentType.paymentMethod
                        });
                        itemProduct.stock = newstock;
                        const userOrder = {
                            orderId: newOrder._id,
                            products: [{
                                productId: newOrder.products[0].productId,
                                productImage: newOrder.products[0].productImage,
                                productName: newOrder.products[0].productName,
                                productPrice: newOrder.products[0].productPrice,
                                quantity: newOrder.products[0].quantity
                            }],
                            shippingCost: newOrder.shippingCost,
                            totalAmount: newOrder.totalAmount,
                            paymentMethod: newOrder.paymentMethod
                        };
                        if (user.address.length < 0 && !user.address.includes(shippingAddress)) {
                            user.address.push(shippingAddress);
                            user.orders.push(userOrder);
                        } else {
                            user.orders.push(userOrder);
                        }
                        return newOrder.save().then(() => itemProduct.save());
                    }
                })
            })
            return Promise.all(promises).then(() => {
                user.cart = [];
                return user.save().then(() => true)
            })
        }
    })
}




// set user as admin

module.exports.setAsAdmin = (reqParams) => {
	let setAdmin = {isAdmin: true};
	return User.findByIdAndUpdate(reqParams.userId, setAdmin).then(update => true).catch(err => err);
};


//================ End of Modules ==================//