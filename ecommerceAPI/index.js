//================ Dependencies =================//

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//=================== Routers ===================//

const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");

//================== Connection =================//

const app = express();
const db = mongoose.connection;
const port = process.env.PORT || 4000;

//===================== App =====================//

mongoose.connect("mongodb+srv://admin:admin123@batch-253-josephobligad.yq72isf.mongodb.net/ecommerceAPI?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
db.once("open", () => console.log("MongoDB Atlas is now running and connected"));
app.use(express.json());
app.use(express.urlencoded({extend: true}));
app.use("/", userRoute);
app.use("/admin", adminRoute);

//==============================================//

if(require.main === module){
	app.listen(port, () => {
		console.log(`Server is now connected to ${port}`)
	});
}

module.exports = app;
