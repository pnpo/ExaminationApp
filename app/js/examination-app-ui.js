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
        //questions bodies
        renderAllQuestions(Qs, Q_size);

        attachClickEvents();
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
    var a_A_number = alinea_tpl.content.querySelectorAll('a')[0];

    Qs.forEach(function(Q) {
        div_Q_body.id = 'q' + Q.number;
        a_Q_value.innerHTML = Q.value + 'v';
        div_Q_text.innerHTML = i_Q_pointer + Q.text;

        var placeholder2 = all_divs[7].children[0];
        placeholder2.innerHTML = '';
        if(Q.alineas !== null && Q.alineas.length > 0) {
            Q.alineas.forEach(function(alinea){
                a_A_number.href = '#q' + Q.number + 'a' + alinea.number;
                a_A_number.innerHTML = Q.number + '.' + alinea.number + ' (' + alinea.value + 'v)';
                var alinea_clone = document.importNode(alinea_tpl.content, true);
                placeholder2.appendChild(alinea_clone);    
            }, this);
        }
        else {
            a_A_number.href = '#q' + Q.number + 'a0';
            a_A_number.innerHTML = Q.number;
            var alinea_clone = document.importNode(alinea_tpl.content, true);
            placeholder2.appendChild(alinea_clone);    
        }

        var clone = document.importNode(main_question_tpl.content, true);
        placeholder1.appendChild(clone);        
    }, this);



}



function attachClickEvents(){
        $('.question-number').click(function(){
            var href = $(this).find('a').attr('href');
            var href_unhashed = href.substring(1); 
            
            //manage active question-number
            if(active_question !== $(this)){
                if(active_question!==null) {
                    active_question.removeClass('active');
                }
                $(this).addClass('active');
                active_question = $(this);
            }

            
           
        });
}


exports.UI = UI;
