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
		adminController.getUserDetails(req.params).then(resultFromController => res.send(resultFromController)).catch(err => res.status(400).send(err));
	}
});

// retrieve all orders

router.get("/orders", (req, res) => {
	adminController.getUserOrder().then(resultFromController => res.send(resultFromController)).catch(err => res.status(400).send(err));
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

router.patch("/product/:productId/activate", auth.verify, (req, res) => {
	const adminVerify = auth.decode(req.headers.authorization).isAdmin;
	if(adminVerify){
		adminController.reactivateProduct(req.params).then(resultFromController => {
			if(!resultFromController){
				return res.status(400).send(resultFromController);
			} else {
				return res.status(204).send(resultFromController)
			}
		})
	} else {
		return res.status(404).send(false);
	}
})

//=================== End of Router =================//

module.exports = router;