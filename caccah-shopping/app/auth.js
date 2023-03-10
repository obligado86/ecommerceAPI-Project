//================ Dependencies =================//

const jwt = require("jsonwebtoken");
const secret = "lksbhadgnlk13asbvguf";

//================== Modules ====================//

//create token
module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin,
		isSeller: user.isSeller
	};
	return jwt.sign(data, secret, {});
};

// verify user
module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;
	if(typeof token !== "undefined"){
		console.log(token);
		token = token.slice(7, token.length);
		return jwt.verify(token, secret, (err, data) => {
			if(err) {
				return false;
			} else {
				next();
			}
		})
	} else {
		return false;
	}
};

// token decryption

module.exports.decode = (token) => {
	if(typeof token !== "undefined"){
		token = token.slice(7, token.length);
		return jwt.verify(token, secret, (err, data) => {
			if(err) {
				return null;
			} else {
				return jwt.decode(token, {complete: true}).payload
			}
		})
	} else {
		return null;
	}
};

//================= End of Modules =================//

