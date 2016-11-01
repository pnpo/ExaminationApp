const {ipcRenderer} = require('electron');

sniff();

let main_notified = false;

function sniff() {
   var timer = setInterval(function(){
        if(navigator.onLine && !main_notified){
            //alert('online');
            main_notified = true;
            ipcRenderer.send('internet-connected',null);
        }
        else if(! navigator.onLine){
            main_notified = false;
            ipcRenderer.send('internet-disconnected', null);
        }
    }, 3000);
}