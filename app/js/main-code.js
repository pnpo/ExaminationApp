const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;
const {UI, PDF} = require('../js/examination-app-ui.js');
const fs = require('fs');

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
        try{
            var stats = fs.statSync(path); 
            if(stats.isDirectory()) {
                ipcRenderer.send('identification_submitted', name, number, url, eid, path);
            }
            else {
                $('#tb_path').val(path + '???').focus();
            }   
        }
        catch (err){
            $('#tb_path').val(path + '???').focus();
        }
        
        return false;
    });

});

ipcRenderer.send('ready-to-render', 'true');

ipcRenderer.on('render-content', (event, content) => {
    var ui = new UI(content);
    ui.render();
    var pdf = new PDF(content);
    pdf.render();
});
