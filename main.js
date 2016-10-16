const app_dir = 'file://' + __dirname + '/app';
const renderer_dir = app_dir + '/renderer';

const electron = require('electron');
const{app, BrowserWindow} = electron;

let screen_w, screen_h;

//windows
let win = null;
let senson = null;


function createMainWindow(){
    win = new BrowserWindow({width:screen_w, height:screen_h, frame:false});
    win.loadURL(renderer_dir+'/main.html');
}

app.on('ready', ()=>{
    var {width,height} = electron.screen.getPrimaryDisplay().workAreaSize;
    screen_w = width;
    screen_h = height;
    createMainWindow();
});