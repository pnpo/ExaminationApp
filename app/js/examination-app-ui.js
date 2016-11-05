const {Exam} = require('./examination-app.js');
const PdfPrinter = require('pdfmake');


let active_question = null;

class UI {
    constructor(ex) {
        this.exam = Exam.loadFromExamObject(ex);
    }

    render(callback) {
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

        callback();
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






// PDF generator handler
class PDF {
    
    get fonts() {
        return  {
            Roboto: {
                normal: __dirname + '/../fonts/Roboto-Regular.ttf',
                bold: __dirname + '/../fonts/Roboto-Medium.ttf',
                italics: __dirname + '/../fonts/Roboto-Italic.ttf',
                bolditalics: __dirname + '/../fonts/Roboto-Italic.ttf'
            }
        };
    }

    get styles() {
        return  {
            header: {
                fontSize: 14,
			    bold: true
            }, 
             header_table: {
                fontSize: 10,
                margin: [0,5,0,0],
            }, 
            answer: {
                fontSize: 10,
                margin: [15,5,0,5],
                color: '#999'
            },
            answer_fixed: {
                bold: true,
                fontSize: 10,
                margin: [15, 0, 0 ,0]
            },
            question: {
                margin: [0,20,0,0]
            },
            question_no: {
                fontSize: 12,
                bold:true,
            },
            question_text: {
                fontSize: 10,
                italics:true,
                margin: [15,5,0,5]
            },
            alinea:{
                margin:[25, 5, 0, 5]
            },
            alinea_no:{
                bold:true
            },
            alinea_answer: {
                margin:[35,5,0,5],
                fontSize:10,
                color:'#999'
            },
            answer_fixed_alinea: {
                bold: true,
                fontSize: 10,
                margin: [35, 0, 0 ,0]
            },
        }
    }

    constructor(ex) {
        this.exam = Exam.loadFromExamObject(ex);   
    }

    render(ex) {
        var A1 = {value:2.5, number:1, text:'Um cao e um mamifero'};
        var A2 = {value:2.5, number:2, text:'Um peixe e um reptil'};
        
        var A1_a = {number:1, text:'Verdadeiro'};
        var A2_a = {number:2, text:'Falso'};

        var contents = {
                // a string or { width: number, height: number }
                pageSize: 'A4',
                // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                pageMargins: [ 40, 40, 40, 60 ],
                content: [
                    this.renderHeader('Av. Continua', 'Algoritmos e Estruturas de Dados (AED I - PL)', 
                                        'LESI - PL', '2 de Nov de 2016','Nuno Oliveira','Aluno Teste', '43549'),
                  this.renderQuestionAndAnswerWithoutAlineas('1', 'Quantas patas ha num pateiro de 6 patos?','5', '12 ou 0, dependendo se nos estamos a referir a patas dos patos ou ao animal pata (fem. do pato).\nOu isso ou outra coisa qualquer.'),                  
                  this.renderQuestionAndAnswerWithAlineas('2', 'Classifique as seguintes afirmações como verdadeiras ou falsas','5',
                                            [A1, A2], [A1_a, A2_a])  
                ],
                styles : this.styles
                
            };
        var printer = new PdfPrinter(this.fonts);
        var pdfDoc = printer.createPdfKitDocument(contents);
        pdfDoc.pipe(printer.fs.createWriteStream('test.pdf'));
        pdfDoc.end();
    }


    renderHeader(type, discipline, course, date, teacher, std_name, std_num) {
        var header = [
            { text: 'Exame ' + type, style: ['header', {alignment:'center'}] },
            { style: 'header_table',
                table: {
                    widths: [ 'auto', '*' ],
                    body: [
                        [ 
                            { text: [ { text: 'Disciplina: ', bold:true },  discipline ] }, 
                            { text: [ { text: 'Curso: ', bold:true }, course ] },
                        ],
                        [ 
                            { text: [ { text: 'Data: ', bold:true },  date ] }, 
                            { text: [ { text: 'Professor: ', bold:true }, teacher ] },
                        ],
                        [ 
                            { text: [ { text: 'Aluno: ', bold:true },  std_name ] }, 
                            { text: [ { text: 'Numero: ', bold:true }, std_num] },
                        ]
					]
				},
                layout: 'noBorders'
			}, 
        ]
        return header;
    }


    renderQuestionAndAnswerWithoutAlineas(number, Q_text, value, answer) {
        var simple_Q = [
            { text: [ { text : 'Questão ' + number, style:'question_no'}, {text: '  ('+ value +' valores)',fontSize:8}], style:'question' },
            {text: Q_text, style:'question_text'},
            {text: 'Resposta: ', style:'answer_fixed'},
            { style: 'answer',
                table: {
                    widths: [ '*' ],
                    body: [
                        [ answer ]
					]
				}
			} 
        ];

        return simple_Q;
    }


    renderQuestionAndAnswerWithAlineas(number, Q_text, value, alineas, answers) {
        var QandAlineas = [
            { text: [ { text : 'Questão ' + number, style:'question_no'}, {text: '  ('+ value +' valores)',fontSize:8}], style:'question' },
            {text: Q_text, style:'question_text'},
            this.renderAlineasAndAnswers(alineas, answers)
        ];

        
        
        return QandAlineas;
    }

    renderAlineasAndAnswers(alineas, answers) {
        var rendered = [];
        for(var i = 0; i < alineas.length; i++) {
            var alinea = alineas[i];
            var alinea_answer = [
                { text: [ { text : ''+alinea.number , style:'alinea_no'}, {text: '('+ alinea.value +' v)',fontSize:8},  {text: ' -- ' + alinea.text, style:'question_text'} ], style:'alinea' },
                {text: 'Resposta: ', style:'answer_fixed_alinea'},
                { style: 'alinea_answer',
                    table: {
                        widths: [ '*' ],
                        body: [
                            [ answers[i].text ]
                        ]
                    }
                }
            ];
            rendered.push(alinea_answer);
        }
        return rendered;
    }

}



exports.UI = UI;
exports.PDF = PDF;
