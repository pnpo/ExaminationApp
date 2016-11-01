const {ipcRenderer} = require('electron');
const {UI, PDF} = require('../js/examination-app-ui.js');

$(document).ready(function() {

    $("#btn_enter").click(function() {
        var name = $('#tb_name').val();
        var number = $('#tb_number').val();
        var url = $('#tb_server').val();
        var eid = $('#tb_eid').val();
        ipcRenderer.sendAsync('identification_submitted', name, number, url, eid);

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
