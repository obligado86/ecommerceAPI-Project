const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");

//====================== Routers =====================//

// register user

router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => {
		if(!resultFromController){
			return res.status(400).send(`${req.body.email} is already been used`)
		} else {
			return res.status(201).send("Registered Successfully")
		}
	}).catch(err => res.send(err))
});

// login account

router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController)).catch(err => res.send(err))
});

// view single product

router.get("/products/:productId", (req, res) => {
	userController.viewProduct(req.params).then(resultFromController => {
		if(!resultFromController){
			res.status(400).send("no products found")
		} else {
			res.status(200).send(resultFromController);
		}
	}).catch(err => err);
})

// see all product list

router.get("/products", (req, res) => {
	userController.browseAllProduct().then(resultFromController => res.status(200).send(resultFromController)).catch(err => res.status(404).send(err));
});

// retrieve all orders

router.get("/:userId/myOrders", auth.verify, (req, res) => {
	const userAuth = auth.decode(req.headers.authorization);
	if(!userAuth.id){
		res.status(404).send("must login to your account first")
	} else if (userAuth.isAdmin){
		res.status(400).send("invalid request")
	} else {
		userController.viewOrders({userId: userAuth.id}).then(resultFromController => {
			if(!resultFromController){
				res.status(400).send("no orders yet");
			} else {
				res.status(200).send(resultFromController);
			}
		});
	}
});

// add to cart

router.put("/products/:productId", auth.verify, (req, res) => {
	const userAuth = auth.decode(req.headers.authorization);
	if(!userAuth.id){
		res.status(404).send("must login to your account first")
	} else {
		return userController.addProductCart(req.params, req.body).then(resultFromController => {
			if(!resultFromController){
				return res.status(400).send("Product is out of Stock");
			} else {
				return res.status(201).send("add item to your cart");
			}
		}).catch(err => err);
	}
});

// view cart items

router.get("/:userId/mycart", auth.verify, (req, res) => {
	const userAuth = auth.decode(req.headers.authorization);
	if(!userAuth.id){
		res.status(400).send("must login to your account first");
	} else {
		return userController.viewCart({userId: userAuth.id}).then(resultFromController => {
			if(!resultFromController){
				res.status(400).send("cart is empty");
			} else {
				res.status(200).send(resultFromController);
			}
		}).catch(err => err);
	}
});

router.delete()

// user checkout

router.post("/:userId/mycart/checkout", auth.verify, (req, res) => {
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
});

// set admin user

router.put("/:userId/setAsAdmin", auth.verify, (req, res) => {
	const userAuth = auth.decode(req.headers.authorization);
	if(userAuth.isAdmin){
		res.status(400).send(false);
	} else {
		return userController.setAsAdmin({userId: userAuth.id}).then(resultFromController => res.status(200).send(resultFromController)).catch(err => err)
	}
});

//=================== End of Router =================//

module.exports = router;