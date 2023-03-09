const mongoose = require("mongoose");

//================= Schema ==================//

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Product name is required"]
	},
	description: {
		type: String,
		required: [true, "Product Description is required"]
	},
	images: [{
		type: String,
		required: true
	}],
	category: {
		type: String,
		required: [true, "Product category is required"]
	},
	brand: {
		type: String,
		default: "None"
	},
	vendor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Seller"
	},
	isActive: {
		type: Boolean,
		default: true
	},
	createdOn: {
		type: Date,
		default: new Date()
	},
	rating: [{
		user: {
			type: mongoose.Schema.types.ObjectId,
			ref: "User"
		},
		rating: {
			type: Number,
			required: true
		},
		comment: {
			type: String,
			required: true
		}
	}],
	isFeatured: {
		type: Boolean,
		default: false
	}
});

//============== End of Schema ==============//

module.exports = mongoose.model("Product", productSchema);