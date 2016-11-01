const app_dir = 'file://' + __dirname + '/app';
const renderer_dir = app_dir + '/renderer';
const modules_dir = app_dir + '/js';

const fs = require('fs');
const electron = require('electron');
const{app, BrowserWindow, ipcMain} = electron;

const {Exam} = require('./app/js/examination-app.js'); 

let screen_w, screen_h;
let exam = new Exam();

//windows
let win = null;
let watchdog = null;
let lockdown = null;


function createMainWindow(){
    win = new BrowserWindow({
        width:screen_w, 
        height:screen_h, 
        frame:false,
        resizable:false,
        movable:false,
        minimizable:false,
        maximazable:false,
        show:false //wait for loading
    });
    win.loadURL(renderer_dir+'/main.html');
    win.once('ready-to-show', () => {
        win.show();
    })
}

function createInternetSensor() {
    watchdog = new BrowserWindow({width:800, height:600, show:false});
    watchdog.loadURL(renderer_dir+'/watchdog.html');
}

app.on('ready', ()=>{
    var {width,height} = electron.screen.getPrimaryDisplay().workAreaSize;
    screen_w = width;
    screen_h = height;
    createMainWindow();
    createInternetSensor();

    fs.readFile('./app/exam_samples/exam1.json', 'utf-8', (err, data) => {
        if (err) throw err;
        exam = Exam.loadFromString(data);
        exam.student.name = 'nuno';
        console.log(exam);
    })

    

});


ipcMain.on('ready-to-render', (event, args)=>{
    event.sender.send('render-content', exam);
});

//Inter-window communications
ipcMain.on('start-sensing-internet', ()=>{
    
});

ipcMain.on('internet-connected', ()=>{
    lockdown = new BrowserWindow({
            width:screen_w, 
            height:screen_h, 
            frame:false, 
            parent:win, 
            resizable:false,
            movable:false,
            minimizable:false,
            maximazable:false,
            alwaysOnTop:true,
            closable:false,
            backgroundColor:'#333'
        });
    lockdown.loadURL(renderer_dir + '/lockdown.html');

    lockdown.on('blur', ()=>{
        lockdown.focus();
        app.focus();
    });
});

ipcMain.on('internet-disconnected', ()=> {
    if(lockdown !== null) {
        lockdown.destroy();
        lockdown = null;
    }
});
