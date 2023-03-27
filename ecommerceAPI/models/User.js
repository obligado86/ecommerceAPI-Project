const mongoose = require("mongoose");

//================= Schema ==================//

const userSchema = new mongoose.Schema({
	
	profilePic: {
		type: String,
		default: "https://cdn.shopify.com/s/files/1/0656/4111/9963/files/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?v=1679838690"
	},
	firstName: {
		type: String,
		required: [true, "First name is required"]
	},
	lastName: {
		type: String,
		required: [true, "Last name is required"]
	},
	email: {
		type: String,
		required: [true, "Email is required"]
	},
	password: {
		type: String,
		required: [true, "Password is required"]
	},
	mobileNumber: {
		type: String,
		required: [true, "Mobile number is required"]
	},
	address: [
		{
			houseNoUnitNo: {
				type: String,
				default: ""
			},
			street: {
				type: String,
				default: ""
			},
			town: {
				type: String,
				default: ""
			},
			city: {
				type: String,
				default: ""
			},
			region: {
				type: String,
				default: ""
			},
			zipCode: {
				type: String,
				default: ""
			}
		}
	],
	isActive: {
		type: Boolean,
		default: true
	},
	cart: [{
		productImage: {
			type: String,
			default: ""
		},
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product"
		},
		productName: {
			type: String,
			required: true
		},
		quantity: {
			type: Number,
			required: true
		},
		price: {
			type: Number,
			required: true
		}
	}],
	orders: [{
		orderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order"
		},
		products: [{
			productId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product"
			},
			productImage: {
				type: String,
				default: ""
			},
			productName: {
				type: String,
				required: true
			},
			productPrice: {
				type: Number,
				required: true
			},
			quantity: {
				type: Number,
				required: true
			},
		}],
		shippingCost: {
			type: Number,
			default: 0
		},
		totalAmount: {
			type: Number,
			required: true
		},
		paymentMethod: {
			type: String,
			default: "Card"
		},
		status: {
			type: String,
			enum: ["pending", "processsing", "shipped out", "delivered", "returned", "canceled"],
			default: "pending"
		},
		purchaseOn: {
			type: Date,
			default: new Date()
		}
	}],
	isAdmin: {
		type: Boolean,
		default: false
	},
	products: [{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product"
		}
	}]
});

//============== End of Schema ===============//

module.exports = mongoose.model("User", userSchema);