var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	phonenum : {type : Number , required: true},
	messages : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : "Message"
	}],
	
		
});

module.exports = mongoose.model("User" , UserSchema);