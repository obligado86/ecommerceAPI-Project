const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../auth");

//====================== Routers =====================//

// retrieve user details

router.get("/:userId/userDetails", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	if(!userData.isAdmin){
		return res.status(404).send("authentication fail");
	} else {
		adminController.getUserDetails(req.params).then(resultFromController => res.status(200).send(resultFromController)).catch(err => res.status(400).send(err));
	}
});

// retrieve user orders

router.get("/:userId/orders", auth.verify, (req, res) => {
	const adminVerify = auth.decode(req.headers.authorization).isAdmin;
	if(!adminVerify){
		return res.status(404).send("authentication fail");
	} else {
		adminController.getUserOrder(req.params).then(resultFromController => res.status(200).send(resultFromController)).catch(err => res.status(400).send(err));
	}
});

// add products

router.post("/newproduct", auth.verify, (req, res) => {
	const adminVerify = auth.decode(req.headers.authorization);
	if(adminVerify.isAdmin){
		adminController.addProduct(req.body).then(resultFromController => {
			if(!resultFromController){
				return res.status(400).send("fail to add products");
			} else {
				return res.status(201).send("Product posted");
			}
		})
	} else {
		res.status(404).send("authentication fail")
	}
});

// update products

router.put("/product/:productId", auth.verify, (req, res) => {
	const adminVerify = auth.decode(req.headers.authorization).isAdmin;
	if(adminVerify){
		adminController.updateProduct(req.params, req.body).then(resultFromController => {
			if(!resultFromController){
				return res.status(404).send(false);
			} else {
				return res.status(400).send(resultFromController);
			}
		})
	} else {
		return res.status(404).send(false)
	}
});

// archive product

router.patch("/product/:productId/archive", auth.verify, (req, res) => {
	const adminVerify = auth.decode(req.headers.authorization).isAdmin;
	if(adminVerify){
	 	adminController.archiveProduct(req.params).then(resultFromController => {
			if(!resultFromController){
				return res.status(400).send("Product is already archive");
			} else {
				return res.status(204).send("achive product");
			}
		}).catch(err => err);
	} else {
		return res.status(404).send(false);
	}
});

// reactivate product

router.patch("/product/:productId/activate", auth.verify, (req, res) => {
	const adminVerify = auth.decode(req.headers.authorization).isAdmin;
	if(adminVerify){
		adminController.reactivateProduct(req.params).then(resultFromController => {
			if(!resultFromController){
				return res.status(400).send("Product is already active");
			} else {
				return res.status(204).send("activate product")
			}
		})
	} else {
		return res.status(404).send(false);
	}
})

//=================== End of Router =================//

module.exports = router;