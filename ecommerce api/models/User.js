const mongoose = require("mongoose");

//================= Schema ==================//

const userSchema = new mongoose.Schema({
	
	firstName: {
		type: String,
		required: [true, "First name is required"]
	},
	lastName : {
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
		totalAmount: {
			type: Number,
			required: true
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