const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../auth");

//====================== Routers =====================//

// retrieve user details

router.get("/:userId/userDetails", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	if(!userData.isAdmin){
		return res.status(404).send(resultFromController);
	} else {
		adminController.getUserDetails(req.params).then(resultFromController => res.send(resultFromController)).catch(err => console.log(err));
	}
});

//retrieve orders by status 

router.get("/orders/:status", (req, res) => {
	adminController.seeOrderByStatus(req.params).then(resultFromController => res.send(resultFromController)).catch(err => console.log(err))
});

// add products

router.post("/newproduct", (req, res) => {
	adminController.addProduct(req.body).then(resultFromController => {
		if(!resultFromController){
			return res.status(400).send(false)
		} else {
			return res.status(201).send(true)
		}
	}).catch(err => console.log(err))
		
});

// update products

router.put("/:productId", (req, res) => {
	adminController.updateProduct(req.params, req.body).then(resultFromController => {
		if(!resultFromController){
			return res.status(404).send(false);
		} else {
			return res.status(400).send(true);
		}
	})
});

// confirm order payment 

router.patch("/:orderId/confirm", (req, res) => {
	adminController.confirmPayment(req.params).then(resultFromController => {
		if(!resultFromController){
			return res.status(200).send(true);
		} else {
			return res.status(400).send(false)
		}
	}).catch(err => console.log(err));
})

// confirm order payment 

router.patch("/:orderId/cancel", (req, res) => {
	adminController.confirmCancel(req.params).then(resultFromController => {
		if(!resultFromController){
			return res.status(200).send(true);
		} else {
			return res.status(400).send(false)
		}
	}).catch(err => console.log(err));
})

// confirm order shippment 

router.patch("/:orderId/toship", (req, res) => {
	adminController.confirmShipment(req.params, req.body).then(resultFromController => {
		if(!resultFromController){
			return res.status(200).send(true);
		} else {
			return res.status(400).send(false)
		}
	}).catch(err => console.log(err));
})

// archive product

router.patch("/product/:productId/archive", (req, res) => {
	adminController.archiveProduct(req.params).then(resultFromController => {
		if(!resultFromController){
			return res.status(400).send(false);
		} else {
			return res.status(204).send(true);
		}
	}).catch(err => err);
});

// reactivate product

router.patch("/product/:productId/activate", (req, res) => {
	adminController.reactivateProduct(req.params).then(resultFromController => {
		if(!resultFromController){
			return res.status(400).send(resultFromController);
		} else {
			return res.status(204).send(false)
		}
	}).catch(err => console.log(err))
})

//=================== End of Router =================//

module.exports = router;