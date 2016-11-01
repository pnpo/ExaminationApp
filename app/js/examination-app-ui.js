const {Exam} = require('./examination-app.js');

let active_question = null;

class UI {
    constructor(ex) {
        this.exam = Exam.loadFromExamObject(ex);
    }

    render() {
        var Q_size = this.exam.questions.length;
        var Qs = this.exam.questions;
        //quesitons numeration
        renderQuestionNumbers(Q_size);
        //disclaimer
        var disclaimer = document.getElementById('disclaimer');
        disclaimer.innerHTML = this.exam.disclaimer;
        //questions body
        renderAllQuestions(Qs, Q_size);

        hideAllQuestions();

        activateQuestionClickEvents();

        activateFillingVerification();
    }
}

function renderQuestionNumbers(n){
    var placeholder = document.querySelector('#questions-placeholder');
    var template = document.querySelector('#question-numbers-template');

    var a = template.content.querySelectorAll('a');

    for( var i = 1; i <= n; i++) {
        a[0].href = '#q' + i;
        a[0].innerHTML = i;
        var clone = document.importNode(template.content,true);
        placeholder.appendChild(clone);
    }
}

function renderAllQuestions(Qs, n) {
    var placeholder1 = document.querySelector('#exam-content');
    var main_question_tpl = document.querySelector('#questions-template');
    var all_divs = main_question_tpl.content.querySelectorAll('div');
    var all_as = main_question_tpl.content.querySelectorAll('a');
    var div_Q_body = all_divs[0];
    var a_Q_value = all_as[0]; 
    var div_Q_text = all_divs[6];
    var i_Q_pointer = div_Q_text.innerHTML;

    var alinea_tpl = document.querySelector('#alineas-template');
    var li_A_class = alinea_tpl.content.children[0];
    var i_A_status = li_A_class.children[0];
    var a_A_number = li_A_class.children[1];
    

    var alinea_body_tpl = document.querySelector('#alineas-body-template');
    var div_A_content = alinea_body_tpl.content.children[0];
    var p_A_text = div_A_content.children[0];
    var i_A_pointer = p_A_text.innerHTML;
    var textarea_A_input = div_A_content.children[1];

    Qs.forEach(function(Q) {
        div_Q_body.id = 'q' + Q.number;
        a_Q_value.innerHTML = Q.value + 'v';
        div_Q_text.innerHTML = i_Q_pointer + Q.text;

        var placeholder2 = all_divs[7].children[0];
        placeholder2.innerHTML = '';
        var placeholder3 = all_divs[8];
        placeholder3.innerHTML = '';
        var i = 0;
        if(Q.alineas !== null && Q.alineas.length > 0) {
            Q.alineas.forEach(function(alinea){
                if(i===0) {
                    $(li_A_class).addClass('active');
                    $(div_A_content).addClass('active');
                }
                else {
                    $(li_A_class).removeClass('active');
                    $(div_A_content).removeClass('active');
                }
                var ref = 'q' + Q.number + 'a' + alinea.number;
                //navbar
                i_A_status.id = 'status-' + ref;
                a_A_number.href = '#' + ref;
                a_A_number.innerHTML = Q.number + '.' + alinea.number + ' (' + alinea.value + 'v)';
                var alinea_clone = document.importNode(alinea_tpl.content, true);
                placeholder2.appendChild(alinea_clone);
                //content
                div_A_content.id = ref;
                p_A_text.innerHTML = i_A_pointer + ' ' + alinea.text;
                textarea_A_input.id = 'answer-'+ref;
                var alinea_content_clone = document.importNode(alinea_body_tpl.content, true);
                placeholder3.appendChild(alinea_content_clone);
                
                i++;
            }, this);
        }
        else {
            var ref = 'q' + Q.number + 'a0';
            //navbar
            li_A_class.className += ' active';
            i_A_status.id = 'status-' + ref;
            a_A_number.href = '#' + ref;
            a_A_number.innerHTML = Q.number;
            var alinea_clone = document.importNode(alinea_tpl.content, true);
            placeholder2.appendChild(alinea_clone); 

             //content
            div_A_content.className += ' active';
            div_A_content.id = ref;
            p_A_text.innerHTML = '';
            textarea_A_input.id = 'answer-' + ref;  
            var alinea_content_clone = document.importNode(alinea_body_tpl.content, true);
            placeholder3.appendChild(alinea_content_clone); 
        }

        var clone = document.importNode(main_question_tpl.content, true);
        placeholder1.appendChild(clone);        
    }, this);



}


function hideAllQuestions(){
    $('.question-body').hide();
}

function activateQuestionClickEvents(){
    $('.question-number').click(function(){
        var href = $(this).find('a').attr('href');
        
        //manage active question-number
        if(active_question !== $(this)){
            if(active_question!==null) {
                active_question.removeClass('active');
            }
            $(this).addClass('active');
            active_question = $(this);
            hideAllQuestions();
            $(href).show();
        }
    });
}

function activateFillingVerification() {
    var list = $('.answer');
    list.keyup(function(){
        var base_id = $(this).attr('id').substring(7);
            var indicator = $('#status-'+base_id);
            if($(this).val().length !== 0) {
            indicator.removeClass('fa-check-square-o');
            indicator.addClass('fa-check-square');
        }
        else {
            indicator.addClass('fa-check-square-o');
            indicator.removeClass('fa-check-square');
        }
    });
}


exports.UI = UI;
