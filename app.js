var  express	 = require("express"),
     app		 = express(),
     mongoose	 = require("mongoose"),
	 User        = require("./models/user.js"),
	 Message     = require("./models/messages.js"),
	 bodyParser  = require("body-parser"),
     server		 = app.listen(5000 , function(){
	 console.log("server started");
});
// BODY-PARSER
app.use(bodyParser.urlencoded({ extended : true}));

app.use(express.static("style"));
// CONNECTION TO MONGODB ATLAS ==========
mongoose.connect("mongodb+srv://ajay:Ajay@1999@gamehub-4rwjm.mongodb.net/test?retryWrites=true&w=majority", {  useNewUrlParser: true,
		 useCreateIndex : true,
	     useUnifiedTopology: true,																					});
// =================================


// LOGIN PAGE
app.get("/", function(req,res){
	res.render("home.ejs");
});

// MAIN PAGE
app.post("/" , function(req,res){
	var phonenum = req.body.mobnum;
	User.findOne({"phonenum" : phonenum} , function(err, founduser){
		if(err){
			console.log(err);
		}else{
			if(founduser){
				// USER EXIST IN DB
				res.render("index.ejs" , { founduser : founduser});
			}else{
				// USER DOES NOT EXIST IN DB
				// CREATE USER 
				User.create({"phonenum" : phonenum,} , function(err, createduser){
					res.render("index.ejs" , { founduser : createduser});
				});	
			}
			
		}
	})
});


// API FOR GETTING USER DATA ==========
app.get("/users/:id" , function(req,res){
	User.findOne({"phonenum" : req.params.id}).populate("messages").exec(function(err , founduser){
		if(err){
			console.log(err);
		}else{
			res.json(founduser);
		}
	})
});
// ==========================


// CHAT BOARD SESSION
app.get("/chat" , function(req,res){
	res.render("index.ejs");
});

var io = require('socket.io').listen(server);	
var SOCKET_LIST = {};
//  CONNECTION OF SOCKET.IO
io.sockets.on('connection', function(socket){
	socket.on("new-connection" , function(data){
		// WHEN NEW USER IS JOIN
		var usernumber = data.phonenum;
		SOCKET_LIST[usernumber] = socket;
		getuserdata(usernumber);
		
		// WHEN USER SENDS NEW MESSAGE
		socket.on("new-mess", function(data){
		   var recievernumber = data.tonumber;
		   var sendernumber = data.fromnumber;
		   var message = data.message;
		   var imgurl = data.imgurl;
			// FIND USER
		   User.findOne({"phonenum" : recievernumber} , async function(err ,founduser){
			 if(err){
				console.log(err);
			  }else{
				  if(!founduser){
					  // USER DOES NOT EXIST IN DB
					  // CREATE NEW USER AND THEN EMIT
					    User.create({"phonenum" : recievernumber} , function(err , createduser){
							if(err){
								console.log(err);
							}else{
								Message.create({
					    			text : message,
					    			from : sendernumber,
					    			to : recievernumber,
									imgurl : imgurl,
				           		} , function(err , newmessage){
									if(err){
										console.log(err);
						   		}else{
									User.findOne({"phonenum" : sendernumber} ,function(err , senderuser){
								if(err){
									console.log(err);
								}else{
									// UPDATE AUTHOR
									newmessage.author.id = senderuser._id;
									newmessage.author.phonenum = senderuser.phonenum;
									newmessage.save();
									// PUSH MESSAGE TO USER
									if(sendernumber == recievernumber){
										senderuser.messages.push(newmessage);
									}else{
										senderuser.messages.push(newmessage);
									    createduser.messages.push(newmessage);
									}
									
									senderuser.save();
									createduser.save();
								// EMIT NEW MESSAGE TO USER TO TO FROM
				                for(var item in SOCKET_LIST){
								if(item == senderuser.phonenum || item == recievernumber ){
								      var socket = SOCKET_LIST[item];
									  socket.emit("latestmessage" , {
									   message : message,
									   sender : senderuser.phonenum,
									   reciever : recievernumber,
									   imgurl : imgurl	  
								     }); 
									}
									
								}
								
							}
						});
						
					}
				})
							}
						});
					   
				      }else{
						  
					  // USER ALREADY EXIST IN DB 
					 // JUST CREATE NEW MESSAGE
				      Message.create({
					    text : message,
					    from : sendernumber,
					    to : recievernumber,
						imgurl : imgurl,
				           } , function(err , newmessage){
							if(err){
								console.log(err);
						   }else{
							User.findOne({"phonenum" : sendernumber} ,function(err , senderuser){
								if(err){
									console.log(err);
								}else{
									newmessage.author.id = senderuser._id;
									newmessage.author.phonenum = senderuser.phonenum;
									newmessage.save();
									if(sendernumber == recievernumber){
										senderuser.messages.push(newmessage);
									}else{
										senderuser.messages.push(newmessage);
									    founduser.messages.push(newmessage);
									}
									
									senderuser.save();
									founduser.save();
								
				                for(var item in SOCKET_LIST){
								if(item == senderuser.phonenum || item == recievernumber ){
								      var socket = SOCKET_LIST[item];
									  socket.emit("latestmessage" , {
									   message : message,
									   sender : senderuser.phonenum,
									   reciever : recievernumber,
									   imgurl : imgurl	  
								     }); 
									}
									
								}
								
							}
						});
						
					}
				})
				}
			}
		});
	});
	// FUNCTION FOR GETTING USER DATA TAKES PARAMA
	 function getuserdata(usernumber){
		 User.findOne({ "phonenum" : usernumber }).populate("messages").exec(function(err,founduser){
			  if(err){
				  console.log(err);
			  }else{
				  socket.emit("userdata" , founduser);
			  }
		  });
	 }
		
	});
});


	
	
	





