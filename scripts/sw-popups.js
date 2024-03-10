export function createPopup(popuptype, modal_title, modal_body, modal_secondary, modal_primary, continueUrl){
    $('#popup-modal').modal('hide');
    $('#temporary-popup').remove();
    if (popuptype == "requested" || popuptype == "req" || popuptype == "request"){
        if(modal_title, modal_body){
            requestedPopup(modal_title, modal_body, modal_secondary, modal_primary, continueUrl);
        }else{
            createPopup("error", "Pop-up", "You must provide a title and body for the requested popup.")
            console.error("You must provide a title and body for the requested popup.");
        }
    }else if(popuptype == "error" || popuptype == "err"){
        if(modal_title, modal_body){
            errorPopup(modal_title, modal_body, continueUrl);
        }else{
            createPopup("error", "Pop-up", "You must provide a body for the error popup.");
            console.error("You must provide a body for the error popup.");
        }
    }else if(popuptype == "maya"){
        easter();
    }else if (popuptype == "custom"){
        customPopup(modal_title);
    }
    else{
        createPopup("error", "Pop-up", "You must provide a valid popup type.");
        console.error("You must provide a valid popup type.");
    }

}

function customPopup(code){
    $('body').append(code);
    $('#popup-modal').modal('show');
    $('#popup-modal').on('hidden.bs.modal', function (e) {
        $('#temporary-popup').remove();
        if(continueUrl){
            window.location.href = continueUrl;
        }
    });
}
window.createPopup = createPopup;
function requestedPopup(modal_title, modal_body, modal_secondary, modal_primary, continueUrl){
    var popup;
    console.log(modal_title, modal_body, modal_secondary, modal_primary)


    if(modal_secondary && !modal_primary){
        popup = `<div id="temporary-popup"><div class="modal fade" id="popup-modal" tabindex="-1" aria-labelledby="BrainifyPopUp" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="BrainifyPopUp">${modal_title}</h1><button type="button" id="close_button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body">${modal_body}</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="modal_secondary">${modal_secondary}</button></div></div></div></div></div>`
    }
    if(modal_primary && !modal_secondary){
        popup = `<div id="temporary-popup"><div class="modal fade" id="popup-modal" tabindex="-1" aria-labelledby="BrainifyPopUp" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="BrainifyPopUp">${modal_title}</h1><button type="button" id="close_button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body">${modal_body}</div><div class="modal-footer"><button type="button" class="btn btn-themed" id="modal_primary">${modal_primary}</button></div></div></div></div></div>`
    }
    if(!modal_primary && !modal_secondary){
        popup = `<div id="temporary-popup"><div class="modal fade" id="popup-modal" tabindex="-1" aria-labelledby="BrainifyPopUp" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="BrainifyPopUp">${modal_title}</h1><button type="button" id="close_button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body">${modal_body}</div></div></div></div></div>`
    }
    if(modal_primary && modal_secondary){
        popup = `<div id="temporary-popup"><div class="modal fade" id="popup-modal" tabindex="-1" aria-labelledby="BrainifyPopUp" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="BrainifyPopUp">${modal_title}</h1><button type="button" id="close_button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body">${modal_body}</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="modal_secondary">${modal_secondary}</button><button type="button" class="btn btn-themed" id="modal_primary">${modal_primary}</button></div></div></div></div></div>`
    }
    $('body').append(popup);
    $('#popup-modal').modal('show');
    $('#popup-modal').on('hidden.bs.modal', function (e) {
        $('#temporary-popup').remove();
        if(continueUrl){
            if(continueUrl == "signOut"){
                signOut(auth).then(() => { 
                    window.href.location = "/";
                } )
            }
            window.location.href = continueUrl;
        }
    });
}

function errorPopup(modal_error_title, modal_error, continueUrl){
    try{
        $('#temporary-popup').remove();
    }catch(err){
        console.log("No popup to remove.")
    }    
    var popup;
    popup = `<div id="temporary-popup"><div class="modal fade" id="popup-modal" tabindex="-1" aria-labelledby="BrainifyPopUp" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="BrainifyPopUp" style="color: #dc3545;">${modal_error_title}</h1><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body" style="color: #dc3545;">${modal_error}</div><div class="modal-footer"></div></div></div></div></div>`
    $('body').append(popup);
    $('#popup-modal').modal('show');
    $('#popup-modal').on('hidden.bs.modal', function (e) {
        $('#temporary-popup').remove();
        if(continueUrl){
            if(continueUrl == "signOut"){
                signOut(auth).then(() => { 
                    window.href.location = "/";
                } )
            }
            window.location.href = continueUrl;
        }
    });
}

function easter(){
    var popup;
    popup = `<div id="temporary-popup"><div class="modal fade" id="popup-modal" tabindex="-1" aria-labelledby="BrainifyPopUp" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="BrainifyPopUp" style="color: #dc3545;"></h1><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body">Maya <3</div><div class="modal-footer"></div></div></div></div></div>`
    $('body').append(popup);
    $('#popup-modal').modal('show');
    $('#popup-modal').on('hidden.bs.modal', function (e) {
        $('#temporary-popup').remove();
    });
}

export function hidePopup(){
    $('#popup-modal').modal('hide');
}