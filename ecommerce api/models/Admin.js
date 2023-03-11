const mongoose = require("mongoose");

//================= Schema ==================//

const adminSchema = new mongoose.Schema({
	Adminuser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	homePageBanner: [{
		type: String,
		required: true
	}],
	featuredProduct: [{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product"
		},
		isActive: {
			type: Boolean,
			default: false
		}
	}],
	products: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product"
	}]
});

//============== End of Schema ==============//

module.exports = mongoose.model("admin", adminSchema);