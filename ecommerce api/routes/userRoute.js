const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");

//====================== Routers =====================//

router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => {
		if(!resultFromController){
			return res.status(400).send(`${req.body.email} is already been used`)
		} else {
			return res.status(201).send("Registered Successfully")
		}
	}).catch(err => res.send(err))
});



router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController)).catch(err => res.send(err))
});


router.get("/allProducts", (req, res) => {
	userController.browseAllProduct().then(resultFromController => res.send(resultFromController)).catch(err => res.status(404).send(err));
})

router.put("/:userId", auth.verify, (req, res) => {
	const userAuth = auth.decode(req.headers.authorization);
	if(!userAuth.id){
		res.status(400).send("must login to your account first")
	} else {
		return userController.addProductCart({userId: userAuth.id}, req.body).then(resultFromController => {
			if(!resultFromController){
				return res.status(400).send("Product is out of Stock");
			} else {
				return res.status(201).send("add item to your cart");
			}
		}).catch(err => err);
	}
})

router.post("/:userId/checkout", auth.verify, (req, res) => {
	const userAuth = auth.decode(req.headers.authorization);
	if(!userAuth.id){
		res.status(400).send("must login to your account first")
	} else {
		return userController.checkOut({userId: userAuth.id}, req.body).then(resultFromController => {
			if(!resultFromController){
				return res.status(400).send("cart is empty");
			} else {
				return res.status(200).send("Your order will be on process. Thank you for shopping with us");
			}
		}).catch(err => err);
	}
})

//=================== End of Router =================//

module.exports = router;