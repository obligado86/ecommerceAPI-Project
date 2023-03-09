const mongoose = require("mongoose");

//================= Schema ==================//

const sellerSchema = new mongoose.Schema({

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	storeName: {
		type: String,
		required: true
	},
	storeDescription: {
		type: String,
		required: true
	},
	storeAddress: [{
		houseNoUnitNo: {
		type: String,
		required: true
		},
		street: {
			type: String,
			required: true
		},
		town: {
			type: String,
			required: true
		},
		city: {
			type: String,
			required: true
		},
		region: {
			type: String,
			required: true
		},
		zipCode: {
			type: String,
			required: true
		}
	}],
	products: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product"
	}]
});


//============== End of Schema ==============//

module.exports = mongoose.model("Seller", sellerSchema);