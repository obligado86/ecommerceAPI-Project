const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");

//====================== Routers =====================//

router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController)).catch(err => res.send(err))
});

//=================== End of Router =================//

module.exports = router;