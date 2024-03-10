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


const prams = new URLSearchParams(window.location.search);
console.log(prams.get('popup'))
if(prams.get('popup') == "createCinema"){
    var code = `
    <div class="form-floating mb-3">
        <input type="text" class="form-control" id="cinemaName" placeholder="Jim's Cinema">
        <label for="cinemaName">Cinema Name</label>
    </div>
    <div class="form-floating">
        <select class="form-select" id="cinemaType">
          <option selected>Select</option>
          <option value="youtube">Youtube</option>
        </select>
    <label for="cinemaType">Cinema Media Type</label>
    </div>`
    createPopup("req", "Create a new cinema.", code, "Cancel", "Create");
    document.getElementById('modal_primary').addEventListener('click', () => {
        const cinemaName = document.getElementById('cinemaName').value;
        const cinemaType = document.getElementById('cinemaType').value;
        $('#popup-modal').remove();
        $('.modal-backdrop').remove();
        createCinemaRoom(cinemaName, cinemaType);
    });
    document.getElementById('modal_secondary').addEventListener('click', () => {
        console.log("Secondary button clicked.")
    });
}



function createCinemaRoom(cinemaName, cinemaType){
    onAuthStateChanged(auth, (user) => {
        if(user){
            const uid = user.uid;
            const roomCode = Math.random().toString(36).substring(2, 8);
            console.log(roomCode);
            
            const room = {
                cinemaName: cinemaName,
                cinemaType: cinemaType,
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
                        createPopup("error", "Error", "You have reached the maximum number of cinema rooms.", "Close", "Try Again");
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
                    if(cinema[0]){
                        get(ref(db, `cinemas/${cinema[0]}`)).then((snapshot) => {
                            if (snapshot.exists()) {
                                document.getElementById('cinema1Name').innerHTML = snapshot.val().cinemaName;
                                document.getElementById('cinema1Button').setAttribute("href", `/cinemas/?id=${cinema[1]}`)  
                            }
                        });
                    }
                    if(cinema[1]){
                        get(ref(db, `cinemas/${cinema[1]}`)).then((snapshot) => {
                            if (snapshot.exists()) {
                                document.getElementById('cinema2Name').innerHTML = snapshot.val().cinemaName;
                                document.getElementById('cinema2Button').setAttribute("href", `/cinemas/?id=${cinema[2]}`)  
                            }
                        });
                    }
                    if(cinema[2]){
                        get(ref(db, `cinemas/${cinema[2]}`)).then((snapshot) => {
                            if (snapshot.exists()) {
                                document.getElementById('cinema3Name').innerHTML = snapshot.val().cinemaName;
                                document.getElementById('cinema3Button').setAttribute("href", `/cinemas/?id=${cinema[3]}`)  
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