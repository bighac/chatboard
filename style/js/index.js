// SELECTION OF DIFFERNET ELEMENT
var chatbox  = document.querySelector("#recentchat");
var chatbox2  = document.querySelector("#allchats");
var imagessession = document.querySelector("#main-row");
var messageform = document.getElementById("messageform");
var tonum = document.getElementById("exampleInputnumber");
var message = document.getElementById("text");
var usertext  = document.getElementById("usernum").textContent;
var usernumber = Number(usertext);
var socket = io();


var imge = document.querySelector("#just-image");
// CLOUDINARY IMAGE UPLOAD PRESET
var CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/instapicapp/image/upload/"
var CLOUDINARY_UPLOAD_PRESET = "tuwvd5hs";

// WHEN NEW CONNECTION IN CREATED SEND USER'S PHONE NUMBER
socket.emit("new-connection" , {
	phonenum  : usernumber,
});


// SUBMIT FORM AND TAKING IMAGES AND UPLOADED TO CLOUDINARY AND EMIT MESSAGE TO NODE SERVER
messageform.addEventListener("submit" , function(e){
	e.preventDefault();
	var file = $("#file")[0].files[0];
	if(file){
		console.log("file exist");
		var formData = new FormData();
	    formData.append("file" , file);
	    formData.append("upload_preset" , CLOUDINARY_UPLOAD_PRESET);
	    axios({
		  url : CLOUDINARY_UPLOAD_URL,
		  method : "POST",
		  headers : {
		   "Content-Type" : "applocation/x-www-form-urlencoded"	
		},
		data : formData
	}).then(function(res){
			// EMIT MESSAGE TO NODE SERVER WHEN IMG FILE IS SELECTED
		 socket.emit("new-mess" , {
	       tonumber : tonum.value,
	       fromnumber : usernumber,
	       message  : message.value,
		   imgurl :  res.data.secure_url
	    });
	}).catch(function(err){
		console.error(err);
	});
	}else{
		// IMG FILE NOT SELECTED
		socket.emit("new-mess" , {
	       tonumber : tonum.value,
	       fromnumber : usernumber,
	       message  : message.value,
		   imgurl :  undefined
	    });
	}	
});


// MESSAGE IS CATCHED FROM SERVER
socket.on("latestmessage" , function(mess){
	   // CAREATING DIVS   
	    var messagediv = document.createElement("div");
		messagediv.setAttribute("class" , "chatitems");
		var h3elm = document.createElement("h3");
		h3elm.textContent = "From - " + mess.sender;
	    var messdiv = document.createElement("div");
	    messdiv.setAttribute("class" , "message-div");
	    console.log(messdiv);
		var messpara = document.createElement("p");
		messpara.textContent =  mess.message;
		messdiv.appendChild(messpara);
	    messagediv.appendChild(h3elm);
	    messagediv.appendChild(messdiv);
	    if(mess.imgurl){
			var imgbox = document.createElement("img");
	   	    imgbox.setAttribute("class" , "images");
	    	imgbox.setAttribute("src" , mess.imgurl);
			messdiv.appendChild(imgbox);
	   }
	  if(mess.sender === usernumber){
			messagediv.setAttribute("id" , "sendermess");
			h3elm.textContent = "You - " + mess.sender;
		}
	    chatbox.appendChild(messagediv);
});




socket.on("userdata" , function(user){
		user.messages.forEach(function(message){
		// message.text
		var messagediv = document.createElement("div");
		messagediv.setAttribute("class" , "chatitems");	
		var h3elm = document.createElement("h3");
		h3elm.textContent = "From - " + message.from;
	    var messdiv = document.createElement("div");
	    messdiv.setAttribute("class" , "message-div");
		var messpara = document.createElement("p");	
		messpara.textContent = message.text;
		messdiv.appendChild(messpara);
	    messagediv.appendChild(h3elm);
		messagediv.appendChild(messdiv);
		if(message.from === usernumber){
		   messagediv.setAttribute("id" , "sendermess");
		   h3elm.textContent = "You - " + message.from ;
		}
		if(message.imgurl){
			var imgbox = document.createElement("img");
	   	    imgbox.setAttribute("class" , "images");
	    	imgbox.setAttribute("src" , message.imgurl);
			messdiv.appendChild(imgbox);
	   }
		chatbox.appendChild(messagediv);
		window.scrollTo(0,document.querySelector(".chatbox").scrollHeight);
	});
  
});

// CLICKED (ALL CONVERSATION TAB)
$("#all-chats").click(async function(){
	var res = await fetch("/users/" + usernumber);
	var users = await res.json();
	chatbox2.textContent = "";
	users.messages.forEach(function(message){
		var messagediv = document.createElement("div");
		messagediv.setAttribute("class" , "chatitems");
		var h3elm = document.createElement("h3");
		h3elm.textContent = "From - " + message.from;
	    var messdiv = document.createElement("div");
	    messdiv.setAttribute("class" , "message-div");
		var messpara = document.createElement("p");	
		messpara.textContent = message.text;
		messdiv.appendChild(messpara);
	    messagediv.appendChild(h3elm);
		messagediv.appendChild(messdiv);
		if(message.from === usernumber){
		   messagediv.setAttribute("id" , "sendermess");
		   h3elm.textContent = "You -" + message.from ;
		}
		if(message.imgurl){
			var imgbox = document.createElement("img");
	   	    imgbox.setAttribute("class" , "images");
	    	imgbox.setAttribute("src" , message.imgurl);
			messdiv.appendChild(imgbox);
	   }
		 chatbox2.appendChild(messagediv);
	});
	
});

// CLICKED IMAGES SESSION BOX(PHOTOS TAB)
$("#images-session").click(async function(){
	var res = await fetch("/users/" + usernumber);
	var users = await res.json();
	imagessession.textContent = "";
	users.messages.forEach(function(message){
		if(message.imgurl){
			  var coldiv = document.createElement("div");
			  coldiv.setAttribute("class" , "col-sm-4 col-md-3");
			  var para2 = document.createElement("p");
			  para2.setAttribute("class" , "chatpara");
			  para2.textContent ="You - " + message.from;
			  var imgelm = document.createElement("img");
		      imgelm.setAttribute("class" , "allimages");
		      imgelm.setAttribute("src" , message.imgurl);
		      coldiv.appendChild(para2);
		      coldiv.appendChild(imgelm);
		      imagessession.appendChild(coldiv);
			if(message.from != usernumber){
				para2.textContent ="From - " + message.from;
			}
	     }
		
		
	});
	
});


	
	
	



