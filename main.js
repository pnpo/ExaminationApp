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

    fs.readFile('./app/exam_samples/exam1.json', 'utf-8', (err, data) => {
        if (err) throw err;
        exam.load(JSON.parse(data));
        exam.student.name = 'nuno';
        console.log(exam);
    })

    

});


//Inter-window communications
ipcMain.on('start-sensing-internet', ()=>{

});
