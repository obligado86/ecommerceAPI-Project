const mongoose = require("mongoose");

//================= Schema ==================//

const orderSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	products: [{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true
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
			default: 1
		}
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
});

//============== End of Schema ==============//

module.exports = mongoose.model("Order", orderSchema);