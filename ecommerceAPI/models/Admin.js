const mongoose = require("mongoose");

//================= Schema ==================//

const orderSchema = new mongoose.Schema({
	homeBanners: [{
		image: {
			type: String,
			required: true
		}
	}]
});

//============== End of Schema ==============//

module.exports = mongoose.model("Order", orderSchema);