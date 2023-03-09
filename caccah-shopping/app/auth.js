//================ Dependencies =================//

const jwt = require("jsonwebtoken");
const secretKey = "lksbhadgnlk13asbvgufan562ofnakjlsfbiapuhjfnoeihf";

//================== Modules ====================//

//create token
module.exports.createAccessToken = (user) => {
	const data ={
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin,
		isSeller: user.isSeller
	};
	return jwt.sign(data, secretKey, {});
};

// verify user
module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;
	if(typeof token !== "undefined"){
		console.log(token);
		token = token.slice(7, token.length);
		return jwt.verify(token, secretKey, (err, data) => {
			if(err) {
				return res.status(400).send({auth: "failed"});
			} else {
				next();
			}
		})
	} else {
		return res.status(400).send({auth: "failed"});
	}
};

// token decryption

module.exports.decode = (token) => {
	if(typeof token !== "undefined"){
		token = token.slice(7, token.length);
		return jwt.verify(token, secretKey, (err, data) => {
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

