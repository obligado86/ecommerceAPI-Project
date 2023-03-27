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
		image: {
			type: String,
			required: true
		}
	}],
	category: {
		type: String,
		required: [true, "Product category is required"]
	},
	brand: {
		type: String,
		required: [true, "product brand is required"]
	},
	stock: {
		type: Number,
		default: 1
	},
	price: {
		type: Number,
		required: true
	},
	isActive: {
		type: Boolean,
		default: function() {
			return this.stock > 0;
		}
	},
	createdOn: {
		type: Date,
		default: new Date()
	},
	productRating: {
		type: Number,
		default: 0,
		max: 5,
		min: 0
	},
	reviews: [{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		rating: {
			type: Number,
			default: 0
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