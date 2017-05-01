var userNameChats = -1; //overwritten on page load but needed to be global
//how we identify what chatroom we are in for most function calls
const groupIDChats = urlSample = window.location.href.split('=')[1];
var userID = 2;  //overwritten on page load but needed to be global
getNumMembers();//start page loading events
messages();//load all messages
//assign the global variable for the username of the current user
function getSessionUsername(){
    $.ajax({
        type: 'POST',
         url:  'DBFuncs.php',
         data: { functionName:'getSessionVar'},
		
        success: function (response) {
                console.log(response);                   
				userNameChats = response;
        }
	});
}

//request all members from the database and send that collection
//to the members function for displaying all of them. 
//Add the length of the collection to the webpage 
function getNumMembers(){
	$.ajax({

                   type: 'POST',
                   url:  'DBFuncs.php',
                   data: { functionName:'getGroupUserList', argument: [groupIDChats]},
                   success: function (response) { 
				   var result = JSON.parse(response);
				   members(response);
				document.getElementById("numMem").innerHTML=" "+result.length;
				messages();
                   }

                });

}
//takes a parameter of a userID
//Sends userID to php call which will return the email address
//and then assign that variable to the calendar source
function getEmailFromUserID(user) { 
    $.ajax({
        type: 'POST',
        url: 'DBFuncs.php',
        data: {
            functionName: 'getCreatorEmail',
            argument: [user]
        },

        success: function(response) {
			if(document.getElementById("calendar").getAttribute("src") == undefined)
				document.getElementById("calendar").setAttribute("src", "https://calendar.google.com/calendar/embed?src=" + response + "&ctz=America/New_York");
        }
    });
}

//uses the global variable groupIDChats and sends that value
//to dbfuncs that will return the creator of this chats
//id and calls the getEmailFromUser with that value.
function getSource() {  
    $.ajax({
        type: 'POST',
        url: 'DBFuncs.php',
        data: {
            functionName: 'getCreator',
            argument: [groupIDChats]
        },

        success: function(response) {
			getEmailFromUserID(response);
        }
    });
}

//takes a collection of members (JSON encoded collection from getNumMembers()
//JSON.parse the collection so it is readable for this function
//adds the members into an unordered list on the group info bar
function members(members) {
	
	var memberCollection = JSON.parse(members);
	if(memberCollection.length == 0)
	{
       document.getElementById("memberList").innerHTML += "<li class=\"groupMembers\">None</li>";
	}
	else
	{
                for (i = 0; i < memberCollection.length; i++) {
                    document.getElementById("memberList").innerHTML += "<li class=\"groupMembers\">" + memberCollection[i].username + "</li>";
                }		
	}
	
}

//Displays all messages in their own object
function messages(){
	
	document.getElementById("groupContainer").innerHTML="";
	$.ajax({
                   type: 'POST',
                   url:  'DBFuncs.php',
                   data: { functionName:'getGroupMessageList', argument:[groupIDChats]},

                   success: function (response) {
				var messageCollection = JSON.parse(response);

			   if(messageCollection.length != 0)
			   {
                        var messages = JSON.parse(response);
                        for(i = 0;i<messages.length;i++)
                        {	
                                document.getElementById("groupContainer").innerHTML+= "<div class = \"post\">"
																					+ "<div class = \"userContainer\">"
																					+"<div class=\"userImageChat\">"
																					+ "</div>"
																					+ "<div class=\"userNameChat\">"+ messages[i].username +"</div>"
																					+"</div><br>"
																					+"<div class = \"messageChat\">"+messages[i].message_body
																					+"</div>"
																					+"</div>";
                        }
                  }
		   }

                });
}
//sets  session values to null and
//redirects the user to the log in page
function logout(){
	setSessionVar();
	window.location.href = "login.html";
}
//redirects the user to their personal profil page
function editProfile(){
    window.location.href = "profile.php?userID=" + userID;
}
//returns the user to the main screen
function main(){
        window.location.href = "Main.php";
}

//gets the userID from  session
//assigns it to userID global var
//calls getSessionUsername
function getUserID(){
    $.ajax({
        type: 'POST',
         url:  'DBFuncs.php',
        data: { functionName:'getSessionUserID'},
        success: function (response) {
                console.log(response);                   
				userID = response;
				getSessionUsername();
        }

    });

}

//Checks if input is empty and if false
//continues to pass the value, groupID, and groupID to php
//function that will add it to the database
//then calls messages to update the display
function submitMessage(){
    var message = document.getElementById("inputMessage").value; //get value of message
	
	if(message.length != 0){
		$.ajax({
   	    type: 'POST',
    	    url:  'DBFuncs.php',
            data: { functionName:'addMessage',argument:[groupIDChats, userID, message] },
                
            success: function (response) {
				document.getElementById("inputMessage").value="";
				messages();
			}
		
		
        });
	}
}

