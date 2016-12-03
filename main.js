const app_dir = 'file://' + __dirname + '/app';
const renderer_dir = app_dir + '/renderer';
const modules_dir = app_dir + '/js';
const fs = require('fs');
const electron = require('electron');
const{app, BrowserWindow, ipcMain} = electron;

const {Exam} = require('./app/js/examination-app.js'); 

const request = require('request');
const async = require('async');

let screen_w, screen_h;
let exam = new Exam();
let exam_dir_path;

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
    
});



//Inter-window communications

//login OK
ipcMain.on('ready-to-render', (event, name, number, url, eid, path)=>{

    var parallel_functions = {};
    parallel_functions.regist = function(callback) {
                registerUser(url, name, number, callback);
            };
    parallel_functions.exam =  function(callback) {
                getExamFromServer(url, eid, callback);
            };
    
    async.parallel(parallel_functions, function(err, results) {
            if(err) {
                console.log(err);
                return;
            }
            if(results.regist === true) {
                results.exam.student.name = name;
                results.exam.student.number = number;
                results.exam.url = url;
                results.exam.id = eid;
                results.exam.dir_path = path;
                event.sender.send('render-content', results.exam);
                return;
            }
        }
    );   
});


ipcMain.on('ready-to-start', (event)=>{
    event.sender.send('start-exam');
});


//sensing the internet communications
ipcMain.on('start-sensing-internet', ()=>{
    createInternetSensor();
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


//auxiliary functions
function getExamFromServer(e_url, e_id, callback) {
    request({
        method: 'GET',
        url: e_url + '/get_exam.php',
        qs: {eid : e_id} 
    }, 
    function(error, response, data){
        if (!error && response.statusCode == 200) {
            var exam = Exam.loadFromString(data);
            callback(null, exam);
            return;
        }
        callback(error,undefined);
        return;
    });
}

function registerUser(url, std_name, std_number, callback) {
    request.post(
        url+'/register_student.php', 
        {form:{name:std_name, number:std_number}}, 
        function(error, response, data){
            if (!error && response.statusCode == 200) {
                callback(null, true);
                return;
            }
            callback(error,false);
            return;
        });
}
