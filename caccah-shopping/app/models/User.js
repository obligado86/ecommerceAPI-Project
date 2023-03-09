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
		}
	],
	isActive: {
		type: Boolean,
		default: false
	},
	purchase: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Transaction"
	}],
	isAdmin: {
		type: Boolean,
		default: false
	},
	isSeller: {
		type: Boolean,
		default: false
	},
	seller: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Seller"
	}

});

//============== End of Schema ===============//

module.exports = mongoose.model("User", userSchema);