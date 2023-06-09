const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");

//====================== Routers =====================//

// register user

router.post("/signup", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => {
		if(!resultFromController){
			return res.status(400).send(false);
		} else {
			return res.status(201).send(true);
		}
	}).catch(err => res.send(err));
});

// login account

router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController)).catch(err => res.send(err))
});

// view single product

router.get("/collection/:productId", (req, res) => {
	userController.viewProduct(req.params).then(resultFromController => {
		if(!resultFromController){
			return res.status(400).send(false);
		} else {
			return res.status(200).send(resultFromController);
		}
	}).catch(err => err);
})



// user details
router.get("/details", (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	userController.getProfile({userId: userData.id}).then(resultFromController => res.send(resultFromController)).catch(err => res.send(err))
});

// user porfile
router.get("/:userId/profile", (req, res) => {
	userController.userProfile(req.params).then(resultFromController => res.status(200).send(resultFromController)).catch(err => console.log(err))
})

//see user pending order by status

router.post("/:userId/orders", (req, res) => {
	userController.seeUserOrder(req.params, req.body).then(resultFromController => res.send(resultFromController)).catch(err => console.log(err))
});

//see products on orders

router.get('/:userId/order/products', (req, res) => {
	userController.seeProductsOrders(req.params).then(resultFromController => res.status(200).send(resultFromController)).catch(err => console.log(err));
})

// see all product list

router.get("/collection", (req, res) => {
	userController.browseAllProduct().then(resultFromController => res.status(200).send(resultFromController)).catch(err => res.status(404).send(err));
});

// see all inactive products

router.get("/archived", (req, res) => {
	userController.allInactiveProduct().then(resultFromController => res.status(200).send(resultFromController)).catch(err => console.log(err));
});

// see products by category

router.post("/collection/category", (req, res) => {
	userController.browseByCategory(req.body).then(resultFromController => res.status(200).send(resultFromController)).catch(err => res.status(404).send(err));
});

//see products by brand

router.post("/collection/brand", (req, res) => {
	userController.browseByBrand(req.body).then(resultFromController => res.status(200).send(resultFromController)).catch(err => res.status(404).send(err));
});

// see products by name

router.get("/products/:name", (req, res) => {
	userController.search(req.params).then(resultFromController => res.status(200).send(resultFromController)).catch(err => res.status(404).send(err));
});

// see user address

router.get("/:userId/address", (req, res) => {
	userController.findAddress(req.params).then(resultFromController => res.status(200).send(resultFromController)).catch(err => res.status(404).send(err));
});

// retrieve all orders

router.get("/:userId/myorder", (req, res) => {
	userController.viewOrders(req.params).then(resultFromController => {
		if(!resultFromController){
			return res.status(400).send(false);
		} else {
			return res.status(200).send(resultFromController);
		}
	}).catch(err => console.log(err))
});

// add to cart

router.put("/collection/:productId", auth.verify, (req, res) => {
	let data = {userId: auth.decode(req.headers.authorization).id}
	userController.addProductCart(data, req.params, req.body).then(resultFromController => {
		if(!resultFromController){
			return res.status(400).send(false);
		} else {
			return res.status(201).send(resultFromController);
		}
	}).catch(err => err);
});

// view cart items

router.get("/:userId/mycart", (req, res) => {
	userController.viewCart(req.params).then(resultFromController => {
		if(!resultFromController){
			return res.status(400).send(false);
		} else {
			return res.status(200).send(resultFromController);
		}
	}).catch(err => err);

});

// delete items from cart

router.patch("/:userId/mycart", (req, res) => {
	userController.deleteCartItem(req.params, req.body).then(resultFromController => {
		if(!resultFromController){
			return res.status(400).send(false);
		} else {
			return res.status(200).send(true);
		}
	}).catch(err => err);
});

// user checkout

router.post("/:userId/mycart/checkout", (req, res) => {
	userController.checkOut(req.params, req.body).then(resultFromController => {
		if(!resultFromController){
			return res.status(400).send(false);
		} else {
			return res.status(200).send(true);
		}
	}).catch(err => err);
});

// cancel order 

router.patch("/:orderId/cancel", (req, res) => {
	userController.cancelOrder(req.params).then(resultFromController => {
		if(!resultFromController){
			return res.status(200).send(true);
		} else {
			return res.status(400).send(false)
		}
	}).catch(err => console.log(err));
})

// confirm recieved order 

router.patch("/:orderId/recieved", (req, res) => {
	userController.recieveOrder(req.params).then(resultFromController => {
		if(!resultFromController){
			return res.status(200).send(true);
		} else {
			return res.status(400).send(false)
		}
	}).catch(err => console.log(err));
})

// set admin user

router.patch("/:userId/setAsAdmin", auth.verify, (req, res) => {
	const userAuth = auth.decode(req.headers.authorization);
	if(userAuth.isAdmin){
		return res.status(400).send(false);
	} else {
		return userController.setAsAdmin(req.params).then(resultFromController => res.status(200).send(resultFromController)).catch(err => err)
	}
});

//=================== End of Router =================//

module.exports = router;