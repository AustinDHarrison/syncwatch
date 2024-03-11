import { createPopup, hidePopup } from "./sw-popups.js";
import { firebaseConfig } from "./sw-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js";
import "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js";


const app = initializeApp(firebaseConfig());
const auth = getAuth();
const db = getDatabase();
const dbRef = ref(getDatabase());


signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously.");
    onAuthStateChanged(auth, (user) => {
        const uid = user.uid;
    });
}).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    createPopup("error", "Error", errorMessage, "Close", "Try Again");
    // ...
  });

export function pageLoad(){
    const prams = new URLSearchParams(window.location.search);
    console.log(prams.get('popup'))

    var page = window.location.pathname;
    if(page.endsWith("/")){
        page = page.slice(0, -1);
    }
    console.log(page);

    const createCinemaPages = ["/cinemas", "/cinema", ""];

    if(createCinemaPages.includes(page) && prams.get('popup') == "createCinema"){
        var code = `
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="cinemaName" placeholder="Jim's Cinema">
            <label for="cinemaName">Cinema Name</label>
        </div>`
        createPopup("req", "Create a new cinema.", code, "Cancel", "Create", "/cinemas");
        document.getElementById('modal_primary').addEventListener('click', () => {
            const cinemaName = document.getElementById('cinemaName').value;
            $('#popup-modal').remove();
            $('.modal-backdrop').remove();
            createCinemaRoom(cinemaName);
        });
        document.getElementById('modal_secondary').addEventListener('click', () => {
            console.log("Secondary button clicked.")
        });
    }

    if(createCinemaPages.includes(page) && prams.get('popup') == "cinemaConfig"){
        const id = prams.get('id');
        get(ref(db, `cinemas/${id}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const cinema = snapshot.val();
                var code = `
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="cinemaName" placeholder="Jim's Cinema" value="${cinema["cinemaName"]}">
                    <label for="cinemaName">Cinema Name</label>
                </div>
                <br>
                    <h4 style="width:12rem;" class="text-themed">Give tickets.</h3>
                <div class="input-group mb-3">
                    <input type="text" class="form-control input-themed" placeholder="User's ID" aria-label="User's ID" aria-describedby="add-button" id="inviteUserInput">
                    <button class="btn btn-themed" type="button" id="add-button">Add</button>
                </div>
                <div id="invites-list">
                    <h5 style="width:11rem;" class="text-themed">Tickets given.</h5>

                </div>`

                createPopup("req", `<p class="text-themed">Edit your <strong>${cinema.cinemaName}</strong> cinema.</p>`, code, null, "Save", "./");
                var itemNames;
                try{
                    itemNames = Object.keys(cinema["invited"]);
                }catch{
                    itemNames = [];
                }
                
                if (itemNames.length > 0) {
                    for (const item in itemNames) {
                        console.log(itemNames[item]);
                        document.getElementById("invites-list").innerHTML += `
                        <div class="input-group mb-3">
                            <input type="text" class="form-control input-themed" value="${itemNames[item]}" disabled>
                        </div>`;
                    }
                } else {
                    document.getElementById("invites-list").innerHTML += `
                    <div class="input-group mb-3">
                        <input type="text" id="no-tickets" class="form-control input-themed" value="No tickets sold." disabled>
                    </div>`;
                }
                document.getElementById('modal_primary').addEventListener('click', () => {
                    const cinemaName = document.getElementById('cinemaName').value;
                    $('#popup-modal').remove();
                    $('.modal-backdrop').remove();
                    updateCinemaRoom(id, cinema, cinemaName);
                    window.location.href = "./";
                });
                document.getElementById('add-button').addEventListener('click', () => {
                    var user = document.getElementById('inviteUserInput').value;
                    if(user){
                        set(ref(db, `cinemas/${id}/invited/${user}`), true).then(() => {
                            document.getElementById("invites-list").innerHTML += `<div class="input-group mb-3"><input type="text" class="form-control input-themed" value="${user}" disabled></div>`;
                            document.getElementById('inviteUserInput').value = "";
                            document.getElementById("no-tickets").remove();
                        });
                    }
                });
            }
        });
    }
}
    
function updateCinemaRoom(id, cinema, cinemaName){
    cinema["cinemaName"] = cinemaName;

    set(ref(db, `cinemas/${id}/cinemaName`), cinemaName);

}

try{
    document.getElementById('deleteCinema1').addEventListener('click', () => {
        deleteCinema(0);
    });
    document.getElementById('deleteCinema2').addEventListener('click', () => {
        deleteCinema(1);
    });
    document.getElementById('deleteCinema3').addEventListener('click', () => {
        deleteCinema(2);
    });
}catch{}

function deleteCinema(index){
    onAuthStateChanged(auth, (user) => {
        if(user){
            const uid = user.uid;
            get(ref(db, `users/${user.uid}/cinemas/${index}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    set(ref(db, `users/${uid}/cinemas/${index}`), null);
                    set(ref(db, `cinemas/${data}`), null);
                } else {
                    console.log("No data available");
                }
            });

        }else{
            signInAnonymously(auth)
            .then(() => {
                console.log("Signed in anonymously.");
                deleteCinema(index);
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                createPopup("error", "Error", errorMessage, "Close", "Try Again");
              });
        }
        window.location.reload();
    });

}
function createCinemaRoom(cinemaName){
    onAuthStateChanged(auth, (user) => {
        if(user){
            const uid = user.uid;
            const roomCode = Math.random().toString(36).substring(2, 8);
            console.log(roomCode);
            
            const room = {
                cinemaName: cinemaName,
                owner: {
                    [uid]: true
                }
            };
            set(ref(db, `cinemas/${roomCode}`), room);
            get(ref(db, `users/${uid}/cinemas/`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    if (!data[0]){
                        set(ref(db, `users/${uid}/cinemas/0`), roomCode);
                    }else if (!data[1]){
                        set(ref(db, `users/${uid}/cinemas/1`), roomCode);
                    }else if (!data[2]){
                        set(ref(db, `users/${uid}/cinemas/2`), roomCode);
                    }else{
                        createPopup("error", "Error", "You have reached the maximum number of cinema rooms.", "Close", "Try Again", "/cinemas");
                    }
                } else {
                    set(ref(db, `users/${uid}/cinemas/`), [roomCode]);
                }
            });

        }else{
            signInAnonymously(auth)
            .then(() => {
                console.log("Signed in anonymously.");
                createCinemaRoom(cinemaName, cinemaType);
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                createPopup("error", "Error", errorMessage, "Close", "Try Again");
              });
        }
    });


}



export function getAccountCinemas(){
    var cinemas;
    onAuthStateChanged(auth, (user) => {
        if(user){
            const uid = user.uid;
            get(ref(db, `users/${uid}/cinemas`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const cinema = snapshot.val();
                    if (cinema[0]) {
                        get(ref(db, `cinemas/${cinema[0]}`)).then((snapshot) => {
                            if (snapshot.exists()) {
                                document.getElementById('cinema1Name').innerHTML = snapshot.val().cinemaName;
                                document.getElementById('cinema1Button').setAttribute("href", `/cinema/?id=${cinema[0]}`);
                                document.getElementById('cinema1Edit').setAttribute("href", `/cinemas/?popup=cinemaConfig&id=${cinema[0]}`);
                                var numberOfInvited = 0;
                                snapshot.child('invited').forEach(childSnapshot => {
                                    numberOfInvited++;
                                });
                                document.getElementById('cinema1InviteCount').innerHTML = `Tickets sold ${numberOfInvited}`;
                            }
                        });
                    }
                    if(cinema[1]){
                        get(ref(db, `cinemas/${cinema[1]}`)).then((snapshot) => {
                            if (snapshot.exists()) {
                                document.getElementById('cinema2Name').innerHTML = snapshot.val().cinemaName;
                                document.getElementById('cinema2Button').setAttribute("href", `/cinema/?id=${cinema[1]}`)  
                                document.getElementById('cinema2Edit').setAttribute("href", `/cinemas/?popup=cinemaConfig&id=${cinema[1]}`)  
                                var numberOfInvited = 0;
                                snapshot.child('invited').forEach(childSnapshot => {
                                    numberOfInvited++;
                                });
                                document.getElementById('cinema2InviteCount').innerHTML = `Tickets sold ${numberOfInvited}`;

                            }
                        });
                    }
                    if(cinema[2]){
                        get(ref(db, `cinemas/${cinema[2]}`)).then((snapshot) => {
                            if (snapshot.exists()) {
                                document.getElementById('cinema3Name').innerHTML = snapshot.val().cinemaName;
                                document.getElementById('cinema3Button').setAttribute("href", `/cinema/?id=${cinema[2]}`)  
                                document.getElementById('cinema3Edit').setAttribute("href", `/cinemas/?popup=cinemaConfig&id=${cinema[2]}`)  
                                var numberOfInvited = 0;
                                snapshot.child('invited').forEach(childSnapshot => {
                                    numberOfInvited++;
                                });
                                document.getElementById('cinema3InviteCount').innerHTML = `Tickets sold ${numberOfInvited}`;

                            }
                        });
                    }
                } else {
                    console.log("No data available");
                }
            });
        }else{
            signInAnonymously(auth)
            .then(() => {
                console.log("Signed in anonymously.");
                getAccountCinemas();
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                createPopup("error", "Error", errorMessage, "Close", "Try Again");
              });
        }
    });
}
