var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	text : "String",
	imgurl : "String",
	time : { type: Date, default: Date.now },
	from : "Number",
	to : "Number",
	author : {
		    id: {
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		     },
		    phonenum : "Number"
	        },
		
});

module.exports = mongoose.model("Message" , UserSchema);