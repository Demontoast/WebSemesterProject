var userNameCheck = true;
var emailCheck = true;

function checkProfile() { 
    var password = document.getElementById("passwordBox").value;
    var confirmPassword = document.getElementById("confirmPasswordBox").value; 
    document.getElementById("passMessage").innerHTML = "";
    document.getElementById("passconfMessage").innerHTML = "";
    console.log("Here");
    console.log(userNameCheck);
    console.log(emailCheck);
    if(userNameCheck == true && emailCheck == true ){
        console.log("Pass"); 
        if(password != confirmPassword)
        {
    	    document.getElementById("passconfMessage").innerHTML = "Passwords do not match";
            return false;
        }
        else
        {
            return true;
        }
    }
    else{
        console.log("What?");
        return false;
    }
}

function checkUsername()
{
    var username = document.getElementById("userBox").value;
    if(username != "") {
    	$.ajax({
  	    type: 'POST',
       	    url:  'DBFuncs.php',
       	    data: { functionName:'checkUsernameReg',argument:[username] },
	    success: function (response){
 	        if(response == 0) {
	    	    document.getElementById("userMessage").innerHTML="Username is already in use";
                    console.log("??");
                    userNameCheck = false;
                    return false;
	        }
                else {
	    	    document.getElementById("userMessage").innerHTML="Username is avaliable";
                    console.log("Username True");
                    userNameCheck = true;
                    return true;
                    
	        }
	    }
	});
    }
    else{
        userNameCheck = true;
        return true;
    }
}

function checkEmail()
{
    console.log("email");
    var email = document.getElementById("emailBox").value;
    console.log(email);
    var googleEmail = /@gmail.com/;
    var rowanEmail = /@students.rowan.edu/;
    console.log("Email" + email);
    if(email != "") {
	if(googleEmail.test(email) == true || rowanEmail.test(email) == true){
            $.ajax({
                type: 'POST',
	        url:  'DBFuncs.php',
                data: { functionName:'checkEmailReg',argument:[email] },
                success: function (response){
                    if(response == 0) {
     	                document.getElementById("emailMessage").innerHTML="  Email is already in use";
                        emailCheck = false;
                        return false;
	            }      
                    else {
	    	        document.getElementById("emailMessage").innerHTML="  Email is valid";
                        emailCheck = true;    
                        return true;  
	            }
	        }            	
            });
        }
        else {
            document.getElementById("emailMessage").innerHTML="  Email must be Google or Rowan account";
            emailCheck = false;
            return false;
        }
    }
    else{
        console.log("Email Pass");
        emailCheck = true;
        return true;
    }
}
