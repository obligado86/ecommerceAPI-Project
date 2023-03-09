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
		default: false
	},
	orders: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Order"
	}],
	isAdmin: {
		type: Boolean,
		default: false
	},
	isSeller: {
		type: Boolean,
		default: false
	},
});

//============== End of Schema ===============//

module.exports = mongoose.model("User", userSchema);