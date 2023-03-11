const mongoose = require("mongoose");

//================= Schema ==================//

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	products: [{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
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
	total: {
		type: Number,
		required: true
	},
	status: {
		type: String,
		enum: ["pending", "processsing", "shipped out", "delivered", "returned", "canceled"],
		default: "pending"
	},
	createdOn: {
		type: Date,
		default: new Date()
	}
});

//============== End of Schema ==============//

module.exports = mongoose.model("Order", orderSchema);