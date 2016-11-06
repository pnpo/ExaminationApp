const {ipcRenderer} = require('electron');

let main_notified = false;

bark();
sniff();



function sniff() {
    //bark();
   var timer = setInterval(bark, 3000);
}

function bark() {
    if(navigator.onLine && !main_notified){
        main_notified = true;
        ipcRenderer.send('internet-connected',null);
    }
    else if(! navigator.onLine){
        main_notified = false;
        ipcRenderer.send('internet-disconnected', null);
    }
}