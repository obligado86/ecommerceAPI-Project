const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const auth = require("../auth");

//====================== Routers =====================//

router.put("/:id", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	console.log(req.params);
	if(userData.isSeller){
		sellerController.updateStoreName(req.params, req.body).then(resultFromController => {
			if(!resultFromController){
				res.status(400).send("fail to update info store name must been use already");
			} else {
				res.status(200).send("seller store name is updated successfully");
			}
		})
	} else {
		res.status(404).send("authentication fail");
	}
	
});

router.post("/:id/newproduct", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	console.log(userData.isSeller)
	if(userData.isSeller){
		sellerController.addProduct(req.params, req.body).then(resultFromController => {
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

//=================== End of Router =================//

module.exports = router;