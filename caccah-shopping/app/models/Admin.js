const mongoose = require("mongoose");

//================= Schema ==================//

const adminSchema = new mongoose.Schema({
	user: {
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
	}]
});

//============== End of Schema ==============//

module.exports = mongoose.model("admin", adminSchema);