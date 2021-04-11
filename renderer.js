

HOST = "https://www.neosvr-api.com"
const USERID = localStorage.getItem("userId")
TOKEN = localStorage.getItem("token")
var test = [""];



function Setup() {
    if (!localStorage.getItem("token")) {
        document.getElementById("login").style.visibility = "visible"
        document.getElementById("logout").style.visibility = "hidden"
    } else {
        document.getElementById("login").style.visibility = "hidden"
        document.getElementById("logout").style.visibility = "visible"
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
                GetFriends()
            })

    }


}

function Login() {
    var EMAIL = document.getElementById("Email").value
    var PASSWORD = document.getElementById("Password").value
    const e = JSON.stringify({
        "ownerId": null,
        "username": null,
        "email": EMAIL,
        "password": PASSWORD,
        "recoverCode": null,
        "sessionToken": null,
        "secretMachineId": null,
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
            document.getElementById("logout").style.visibility = "visible"
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
            document.getElementById("login").style.visibility = "visible"
            document.getElementById("logout").style.visibility = "hidden"
            localStorage.clear();
            clearInterval(myVar);
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
            document.getElementById("demo").innerHTML = test;
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
                                col = "#42f56f"
                                break;
                            case "Away":
                                col = "#ffbb00"
                                break;
                            case "Busy":
                                col = "#ff0000"
                                break;
                            default:
                                break;
                        }
                        if (data[i].profile)jQuery(friends).append('<div class="rounded" style="padding-top: 10px;"><img onclick="GetInbox(\'' + data[i].id + '\')" style="height: 5pc;border-radius: 90px; box-shadow: 0px 0px 16px 1px ' + col + ';" src="' + GetAsset(data[i].profile.iconUrl) + '"><div id="userinfo"><span class="name">' + data[i].friendUsername + '\n </span><span class="session">' + GetWorldStatus(data[i].userStatus.activeSessions[0])  + ''+ GetJoinURL(data[i].userStatus.activeSessions[0]) +'</span></div></div>');
                            else jQuery(friends).append('<div class="rounded" style="padding-top: 10px;"><img onclick="GetInbox(\'' + data[i].id + '\')" style="height: 5pc;border-radius: 90px; box-shadow: 0px 0px 16px 1px ' + col + ';" src="https://lh3.googleusercontent.com/proxy/ZnJtZRW8Bi4-IFfJPdVA_52bVoL-L_o_qQSriBaWoAj4iYGfyPENUghzm87CucCVPpXpqzgQPtOSVqr-SOixtQjq7ngzGR5bCXnueiiAnMMyYvZl4kG3">User: ' + data[i].friendUsername + '\n ' + GetWorldStatus(data[i].userStatus.activeSessions[0]) + '</div>');
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
        return '<button id="button1" onclick="window.open(document.URL, "_blank", "location=yes,height=570,width=520,scrollbars=yes,status=yes");" type="button" class="btn btn-danger" disabled>Join</button>'
    }
    else return `<button id="button1" onclick="window.location.href=neos:?world=neos-session:///${e.sessionId}' type="button" class="btn btn-success">Join</button>`;
} 
function GetInbox(e) {

    return fetch(HOST + "/api/users/" + localStorage.getItem("userId") + "/messages?maxItems=100&user=" + e, {
            method: "GET",
            headers: {
                Authorization: "neos " + localStorage.getItem("userId") + ":" + localStorage.getItem("token")
            },
            cache: "no-cache"
        }).then(response => response.json())
        .then(data => {
            document.getElementById("Messages").innerHTML = "";
            console.log(data);
            for (var i = 0; i < data.length; i++) {

                switch (data[i].messageType) {
                    case "Sound":
                        let content = JSON.parse(data[i].content)
                        jQuery(Messages).append('<div class="rounded">User: ' + data[i].senderId + ', <audio controls><source src="' + GetAsset(content.assetUri) + '" type="audio/ogg"></audio></div>');
                        break;
                    case "SessionInvite":
                        break
                    default:
                        jQuery(Messages).append('<div class="rounded">User: ' + data[i].senderId + ', Message: ' + data[i].content + '</div>');
                        break;
                }
            }


        })
}
new Titlebar({
	backgroundColor: Color.fromHex('#ECECEC')
});