

HOST = "https://www.neosvr-api.com"
const USERID = localStorage.getItem("userId")
TOKEN = localStorage.getItem("token")
var test = [""];



function Setup() {
    if (!localStorage.getItem("token")) {
        document.getElementById("login").style.visibility = "visible"
        document.getElementById("main").style.visibility = "hidden"
    } else {
        document.getElementById("login").style.visibility = "hidden"
        document.getElementById("main").style.visibility = "visible"
        return fetch(HOST + "/api/users/" + localStorage.getItem("userId"), {
                method: "GET",
                headers: {
                    Authorization: "neos " + localStorage.getItem("userId") + ":" + localStorage.getItem("token")
                },
                cache: "no-cache"
            }).then(response => response.json())

            .then(data => {
                console.log(data);
                document.getElementById('logoutbtn').value = data.username + " Logout"
                AuthCheck()
            })

    }


}

function AuthCheck(){
    return fetch(HOST + "/api/users/" + localStorage.getItem("userId") + "/friends", {
        method: "GET",
        headers: {
            Authorization: "neos " + localStorage.getItem("userId") + ":" + localStorage.getItem("token")
        },
        cache: "no-cache"
    }).then(function (response) {
        console.log(response.status); // returns 200
        if (response.status == 413) {
            alert("You have been logged out, Login Again")
            document.getElementById("login").style.visibility = "visible"
            document.getElementById("logout").style.visibility = "hidden"
            localStorage.clear();
            clearInterval(myVar);
        }
        else GetFriends()
    });
}

function Login() {
    var EMAIL = document.getElementById("Email").value
    var PASSWORD = document.getElementById("Password").value
    var MachineID = document.getElementById("MachineID").value
    const e = JSON.stringify({
        "ownerId": null,
        "username": null,
        "email": EMAIL,
        "password": PASSWORD,
        "recoverCode": null,
        "sessionToken": null,
        "secretMachineId": MachineID,
        "rememberMe": true
    });
    return fetch(HOST + "/api/userSessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            cache: "no-cache",
            body: e
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            test.push("Hello " + data.userId)
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            document.getElementById("login").style.visibility = "hidden"
            document.getElementById("main").style.visibility = "visible"
            GetFriends()
        })
}

function Logout() {
    return fetch(HOST + "/api/userSessions/" + localStorage.getItem("userId") + "/" + localStorage.getItem("token"), {
        method: "DELETE",
        headers: {
            Authorization: "neos " + localStorage.getItem("userId") + ":" + localStorage.getItem("token")
        },
        cache: "no-cache"
    }).then(function (response) {
        console.log(response.status); // returns 200
        if (response.status == 200) {
            alert("Logged Out")
            document.getElementById("login").style.visibility = "visible"
            document.getElementById("main").style.visibility = "hidden"
            localStorage.clear();
            clearInterval(myVar);
            $(friends).empty();
        }
    });
}

function GetFriends() {
    return fetch(HOST + "/api/users/" + localStorage.getItem("userId") + "/friends", {
            method: "GET",
            headers: {
                Authorization: "neos " + localStorage.getItem("userId") + ":" + localStorage.getItem("token")
            },
            cache: "no-cache"
        }).then(response => response.json())
        .then(data => {
            console.log(data.length)
            console.log(data);
            $.notify("Got Friends", "success");
            $('#friends').empty();
            for (var i = 0; i < data.length; i++) {
                if (!data[i].userStatus) {
                    console.log("skipped")
                  }
                  else {
                    if (data[i].userStatus.onlineStatus != 'Offline') {
                        let col = "blue"
                        switch (data[i].userStatus.onlineStatus) {
                            case "Online":
                                col = "online"
                                break;
                            case "Away":
                                col = "away"
                                break;
                            case "Busy":
                                col = "offline"
                                break;
                            default:
                                break;
                        }
                        console.log(data[i])
                        if (data[i].profile)jQuery(friends).append(
                            '<li><div class="d-flex bd-highlight"><div class="img_cont"><img src="' + GetAsset(data[i].profile.iconUrl) + '" class="rounded-circle user_img"><span class="online_icon '+ col +'"></span></div><div class="user_info"><span onclick="GetUser(\'' + data[i].id + '\')"">' + data[i].friendUsername + '</span><p>'+ GetWorldStatus(data[i].userStatus.activeSessions[0]) +'</p>'+ GetJoinURL(data[i].userStatus.activeSessions[0]) +'</div></div></li>');
                            else jQuery(friends).append('<li><div class="d-flex bd-highlight"><div class="img_cont"><img src="https://cdn.discordapp.com/attachments/495033101798473749/831273842751438859/vr-6037930_960_720.png" class="rounded-circle user_img"><span class="online_icon '+ col +'"></span></div><div class="user_info"><span>' + data[i].friendUsername + '</span><p>'+ GetWorldStatus(data[i].userStatus.activeSessions[0]) +'</p>'+ GetJoinURL(data[i].userStatus.activeSessions[0]) +'</div></div></li>');
                    }
                  }
                onlineStatus = "Offline"
                //console.log(data[i].userStatus.onlineStatus)



            }
        })
}

var myVar = setInterval(myTimer, 20000);

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("Messages").innerHTML = "";
}

function myTimer() {
    var d = new Date();
    GetFriends();
    console.log(d)
}

function GetAsset(e) {
    if (!e){
        return "https://lh3.googleusercontent.com/proxy/ZnJtZRW8Bi4-IFfJPdVA_52bVoL-L_o_qQSriBaWoAj4iYGfyPENUghzm87CucCVPpXpqzgQPtOSVqr-SOixtQjq7ngzGR5bCXnueiiAnMMyYvZl4kG3"
    }
    return "" === e ? "" : "https://cloudxstorage.blob.core.windows.net/assets" + ("" === e ? "" : e.split("//")[1].split(".")[0])

}
// Get the modal
var modal = document.getElementById("messages");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function GetWorldStatus(e) {
    if (!e) {
        return "Privete or Hidden World"
    }
    else return e.name
}
function GetJoinURL(e){
    if (!e) {
        return '<button id="button1" type="button" class="btn btn-outline-danger" onclick="alert("This is not a joinable session")">Join</button>'
    }   
    else return `<button type="button" class="btn btn-outline-success" onclick="window.location.href='neos:?world=neos-session:///${e.sessionId}'">Join</button>`;
} 
function GetInbox(e) {

    return fetch(HOST + "/api/users/" + localStorage.getItem("userId") + "/messages?maxItems=100&user=" + e, {
            method: "GET",
            headers: {
                Authorization: "neos " + localStorage.getItem("userId") + ":" + localStorage.getItem("token")
            },
            cache: "reload"
            
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("inbox").innerHTML = "";
            console.log(data);

            for (var i = 0; i < data.length; i++) {

                switch (data[i].messageType) {
                    case "Sound":
                        let content = JSON.parse(data[i].content)
                        if (data[i].recipientId === localStorage.getItem("userId")){
                            jQuery(inbox).append('<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send"><audio controls><source src="' + GetAsset(content.assetUri) + '" type="audio/ogg"><span class="msg_time">' + data[i].senderId + '</span></div></div>');
                            break   
                        }
                        else
                        jQuery(inbox).append('<div class="d-flex justify-content-start mb-4"><div class="msg_cotainer"><audio controls><source src="' + GetAsset(content.assetUri) + '" type="audio/ogg"><span class="msg_time">You</span></div></div>');
                        break   
                    case "SessionInvite":
                        break
                    case "Object":
                        break
                    case "CreditTransfer":
                        NCR = JSON.parse(data[i].content)
                        console.log(NCR)
                        if (data[i].recipientId === localStorage.getItem("userId")){
                            jQuery(inbox).append('<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">Recived ' + NCR.amount + NCR.token +'<span class="msg_time">' + data[i].senderId + '</span></div></div>');
                            break   
                        }
                        else
                        jQuery(inbox).append('<div class="d-flex justify-content-start mb-4"><div class="msg_cotainer">Sent ' + NCR.amount + NCR.token +'<span class="msg_time">You</span></div></div>');
                        break
                    default:
                        if (data[i].recipientId == localStorage.getItem("userId")){
                            
                            jQuery(inbox).append('<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">' + data[i].content + '<span class="msg_time">' + data[i].senderId + '</span></div></div>');
                            break
                        }
                        else
                        jQuery(inbox).append('<div class="d-flex justify-content-start mb-4"><div class="msg_cotainer">' + data[i].content + '<span class="msg_time">You</span></div></div>');
                        break;
                }
            }


        })
}
new Titlebar({
	backgroundColor: Color.fromHex('#ECECEC')
});

function GetUser(e) {
    return fetch(HOST + "/api/users/" + e, {
            method: "GET",
            cache: "no-cache"
        }).then(response => response.json())
        .then(data => {
            console.log(data.length)
            console.log(data);
            document.getElementById("userinfo").innerHTML = "";
            document.getElementById("inbox").innerHTML = "";
            $.notify("Getting Messages", "success");
            jQuery(userinfo).append(
                '<div class="d-flex bd-highlight"><div class="img_cont"><img src="' + GetAsset(data.profile.iconUrl) + '" class="rounded-circle user_img"><span class="online_icon"></span></div><div class="user_info"><span>'+ data.username +'</span><p>1767 Messages</p></div><div class="video_cam"><span><i class="fas fa-video"></i></span><span><i class="fas fa-phone"></i></span></div></div>');
                onlineStatus = "Offline"
                //console.log(data[i].userStatus.onlineStatu
                GetInbox(e)

            }
        )
}

