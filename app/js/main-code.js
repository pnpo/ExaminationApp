const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;
const {UI, PDF, Timer} = require('../js/examination-app-ui.js');
const fs = require('fs');

let current_page = '#login_page';

$(document).ready(function() {

    $('#btn_dir_chooser').click(function(){
        var path = dialog.showOpenDialog({
                    properties: ['openDirectory', 'createDirectory']
                });
        $('#tb_path').val(path).focus();
    });

    $("#btn_enter").click(function() {
        var name = $('#tb_name').val();
        var number = $('#tb_number').val();
        var url = $('#tb_server').val();
        var eid = $('#tb_eid').val();
        var path = $('#tb_path').val();
        try {
            var stats = fs.statSync(path); 
            if(stats.isDirectory()) {
                ipcRenderer.send('ready-to-render', name, number, url, eid, path);
                changeToPage('#loading_page') ;
            }
            else {
                $('#tb_path').val().focus();
                $('#btn_enter').click();
            }   
        }
        catch (err){
            $('#tb_path').val("").focus();
            $('#btn_enter').click();
        }
        
        return false;
    });


    $('#btn_start').click(function(){
            //ipcRenderer.send('start-sensing-internet');
            ipcRenderer.send('ready-to-start');
            return false;
        });

});


function changeToPage(page_id) {
    $(current_page).hide();
    $(page_id).show();
    current_page = page_id;
}

ipcRenderer.on('render-content', (event, content) => {
    var ui = new UI(content);
    ui.render(()=>{
        $('#loading-message').hide();
        $('#internet-advise').show();
    });
    //var pdf = new PDF(content);
    //pdf.render();
});


ipcRenderer.on('start-exam', (event)=>{
    changeToPage('#exam_page');
    var timer = new Timer('#exam_elapsed', {sep_hm:'h ', sep_ms:'min ', sep_sms:'s'});
    timer.start();
});





