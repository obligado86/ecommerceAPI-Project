const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../auth");

//====================== Routers =====================//

// retrieve user details

router.get("/:userId/userDetails", auth.verify, (req, res) => {
	const adminVerify = auth.decode(req.headers.authorization).isAdmin;
	if(!adminVerify){
		res.status(404).send("authentication fail");
	} else {
		adminController.getUserDetails(req.params.id).then(resultFromController => res.status(200).send(resultFromController)).catch(err => res.status(400).send(err));
	}
});

// retrieve user orders

router.get("/:userId/orders", auth.verify, (req, res) => {
	const adminVerify = auth.decode(req.headers.authorization).isAdmin;
	if(!adminVerify){
		res.status(404).send("authentication fail");
	} else {
		adminController.getUserOrder(req.params.id).then(resultFromController => res.status(200).send(resultFromController)).catch(err => res.status(400).send(err));
	}
});

// add products

router.post("/newproduct", auth.verify, (req, res) => {
	const adminVerify = auth.decode(req.headers.authorization).isAdmin;
	console.log(userData.isSeller)
	if(adminVerify){
		adminController.addProduct({userId: adminVerify.id}, req.body).then(resultFromController => {
			if(!resultFromController){
				res.status(400).send("fail to add products");
			} else {
				res.status(201).send("Product posted");
			}
		})
	} else {
		res.status(404).send("authentication fail")
	}
});

// update products

router.put("/products/:productId", auth.verify, (req, res) => {
	const adminVerify = auth.decode(req.headers.authorization).isAdmin;
	if(adminVerify){
		adminController.updateProduct(req.params, req.body).then(resultFromController => {
			if(resultFromController){
				res.status(204).send("update successful")
			} else {
				res.status(400).send(false)
			}
		})
	} else {
		res.status(404).send(false)
	}
});

// archive product

router.put("/products/:productId/archive", auth.verify, (req, res) => {
	const adminVerify = auth.decode(req.headers.authorization).isAdmin;
	if(adminVerify){
		adminController.archiveProduct(req.params).then(resultFromController => res.status(204).send("achive product")).catch(err => err)
	} else {
		return false;
	}
});


//=================== End of Router =================//

module.exports = router;