const app_dir = 'file://' + __dirname + '/app';

const electron = require('electron');
const{app, BrowserWindow} = electron;

//windows
const win = null;
const senson = null;

app.on('ready', ()=>{
    var win = new BrowserWindow({width:800, height:600});
    //mainWindow();
});