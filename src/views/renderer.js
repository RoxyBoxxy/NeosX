
HOST = "https://www.neosvr-api.com"
const USERID = localStorage.getItem("userId")
TOKEN = localStorage.getItem("token")
var test = [""];



function Setup() {
    if (!localStorage.getItem("token")) {
        document.getElementById("login").style.visibility = "visible"
        document.getElementById("main").style.visibility = "hidden"
        clearInterval(myVar);
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
                account.append(new nw.MenuItem({ label: data.username + ' Logout', click: function(){Logout();} }));
                account.append(new nw.MenuItem({ label: 'NCR ' + parseFloat(data.credits.NCR).toFixed(2), click: function(){prompt("Your NCR deposit Address", data.NCRdepositAddress);} }));
                document.getElementById('logoutbtn').value = data.username + " Logout"
                AuthCheck()
            })

    }


}

function GenMachineID(length){
        var result           = [];
        var characters       = 'oqep_l3v-u6lom2gftbciw';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result.push(characters.charAt(Math.floor(Math.random() * 
     charactersLength)));
       }
       return result.join('');
}

function SetMachineID(){
    if (!localStorage.getItem("MachineID")) {
        var ID = GenMachineID(22)
        localStorage.setItem("MachineID", ID)
    }
    else
    console.log("I already have" + localStorage.getItem("MachineID"))
}

function AuthCheck() {
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
        } else GetFriends()
        setInterval(myTimer, 90000);
    });
}

function Login() {
    SetMachineID();
    var EMAIL = document.getElementById("Email").value
    var PASSWORD = document.getElementById("Password").value
    localStorage.setItem("Email", document.getElementById("Email").value)
    const e = JSON.stringify({
        "ownerId": null,
        "username": null,
        "email": EMAIL,
        "password": PASSWORD,
        "recoverCode": null,
        "sessionToken": null,
        "secretMachineId": localStorage.getItem("MachineID"),
        "rememberMe": true
    });
    return fetch(HOST + "/api/userSessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            cache: "no-cache",
            body: e
        })
        
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            //store(data)

            document.getElementById("login").style.visibility = "hidden"
            document.getElementById("main").style.visibility = "visible"
            notyf.success('Logged In!');
            GetFriends()
        })
        .catch(() => {
            notyf.error('Wrong Email or Password');
          });
        
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
            
            notyf.success('Updated Contacts!');
            $('#friends').empty();
            for (var i = 0; i < data.length; i++) {
                if (!data[i].userStatus) {
                    console.log("skipped")
                } else {
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
                        if (data[i].profile) jQuery(friends).append(
                            '<li><div class="d-flex bd-highlight"><div class="img_cont"><img src="' + GetAsset(data[i].profile.iconUrl) + '" class="rounded-circle user_img"><span class="online_icon ' + col + '"></span></div><div class="user_info"><span onclick="GetUser(\'' + data[i].id + '\')"">' + data[i].friendUsername + '</span><p>' + GetWorldStatus(data[i].userStatus.activeSessions[0]) + '</p>' + GetJoinURL(data[i].userStatus.activeSessions[0]) + '</div></div></li>');
                        else jQuery(friends).append('<li><div class="d-flex bd-highlight"><div class="img_cont"><img src="https://cdn.discordapp.com/attachments/495033101798473749/831273842751438859/vr-6037930_960_720.png" class="rounded-circle user_img"><span class="online_icon ' + col + '"></span></div><div class="user_info"><span onclick="GetUser(\'' + data[i].id + '\')">' + data[i].friendUsername + '</span><p>' + GetWorldStatus(data[i].userStatus.activeSessions[0]) + '</p>' + GetJoinURL(data[i].userStatus.activeSessions[0]) + '</div></div></li>');
                    }
                }
                onlineStatus = "Offline"
                //console.log(data[i].userStatus.onlineStatus)



            }
        })
}

//var myVar = setInterval(myTimer, 20000);

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
    if (!e) {
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
    } else return e.name
}

function GetJoinURL(e) {
    if (!e) {
        return '<button id="button1" type="button" class="btn btn-outline-danger" onclick="alert("This is not a joinable session")">Join</button>'
    } else return `<button type="button" class="btn btn-outline-success" onclick="window.location.href='neos:?world=neos-session:///${e.sessionId}'">Join</button>`;
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
                        if (data[i].recipientId === localStorage.getItem("userId")) {
                            jQuery(inbox).append('<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send"><audio controls><source src="' + GetAsset(content.assetUri) + '" type="audio/ogg"><span id="user" class="msg_time">' + data[i].senderId + '</span></div></div>');
                            break
                        } else
                            jQuery(inbox).append('<div class="d-flex justify-content-start mb-4"><div class="msg_cotainer"><audio controls><source src="' + GetAsset(content.assetUri) + '" type="audio/ogg"><span class="msg_time">You</span></div></div>');
                        break
                    case "SessionInvite":
                        break
                    case "Object":
                        break
                    case "CreditTransfer":
                        NCR = JSON.parse(data[i].content)
                        console.log(NCR)
                        if (data[i].recipientId === localStorage.getItem("userId")) {
                            jQuery(inbox).append('<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">Recived ' + NCR.amount + NCR.token + '<span id="user" class="msg_time">' + data[i].senderId + '</span></div></div>');
                            break
                        } else
                            jQuery(inbox).append('<div class="d-flex justify-content-start mb-4"><div class="msg_cotainer">Sent ' + NCR.amount + NCR.token + '<span class="msg_time">You</span></div></div>');
                        break
                    default:
                        if (data[i].recipientId == localStorage.getItem("userId")) {

                            jQuery(inbox).append('<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">' + data[i].content + '<span id="user" class="msg_time">' + data[i].senderId + '</span></div></div>');
                            break
                        } else
                            jQuery(inbox).append('<div class="d-flex justify-content-start mb-4"><div class="msg_cotainer">' + data[i].content + '<span  class="msg_time">You</span></div></div>');
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
            notyf.success('Got Inbox!');
            jQuery(userinfo).append(
                '<div class="d-flex bd-highlight"><div class="img_cont"><img src="' + GetAsset(data.profile.iconUrl) + '" class="rounded-circle user_img"><span class="online_icon"></span></div><div class="user_info"><span>' + data.username + '</span><p></p></div></i></span><span></i></span></div></div>');
            onlineStatus = "Offline"
            localStorage.setItem('msguser', data.id)
            //console.log(data[i].userStatus.onlineStatu
            GetInbox(e)

        })
        .catch(() => {
            notyf.error('Error Getting Inbox!, Try Later');
          });
}
function prepmsg(){
   console.log()
}

function SendMsg(b){
    const msg = JSON.stringify({
        "content": b,
        "id": null,
        "lastUpdateTime": null,
        "messageType": "Text",
        "ownerId": null,
        "readTime": null,
        "recipientId": null,
        "sendTime": null,
        "senderId": null
    });
    return fetch(HOST + "/api/users/" + localStorage.getItem('msguser') + "/messages", {
        method: "POST",
        headers: {
            Authorization: "neos " + localStorage.getItem("userId") + ":" + localStorage.getItem("token")
        },
        body: msg
    })
}