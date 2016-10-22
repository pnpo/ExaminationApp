//ES6

class Student {
    constructor() {
        this.name = '';
        this.number = -1;
    }
}

class Answer {
    constructor(){
        this.number = -1;
        this.text = '';
    }
}

class Question {
    constructor(){
        this.number = -1;
        this.text = '';
        this.alineas = null //array of Question;
        this.value = -1;
    }
}


class Exam {
    constructor(){
        this.student = new Student();
        this.teacher = '';
        this.disclaimer = '';
        this.date = '';
        this.id = '';
        this.questions = null; //array of questions;
        this.answers = null; //array of answers;
        this.url = '';
    }   

    processQuestions(questions) {
        var Qs = new Array();
        var i;
        for(i = 0; i < questions.length; i++) {
            var Q = new Question();
            Q.number = i+1;
            Q.value = questions[i].value;
            Q.text = questions[i].text;
            var alineas = questions[i].alineas; 
            if(alineas !== undefined) {
                Q.alineas = this.processQuestions(alineas);
            }
            Qs.push(Q);
        } 

        return Qs;
    }

    load(input){
        var exam = input.exam;
        this.id = exam.id;
        this.teacher = exam.teacher;
        this.date = exam.date;
        
        var Qs = exam.questions;
        this.questions = this.processQuestions(Qs);
        this.answers = new Array();
    }

    

    render(){}

    formatPDF(){}


}

/*
function Student() {
    this.name = '';
    this.number = -1;
}

function Answer() {
    this.number = -1;
    this.text = '';
}

function Question() {
    this.number = -1;
    this.text = '';
    this.alineas = null //array of Question;
    this.value = -1;
}


function Exam() {
    this.student = new StudentCls();
    this.teacher = '';
    this.disclaimer = '';
    this.date = '';
    this.id = '';
    this.questions = null; //array of questions;
    this.answers = null; //array of answers;
    this.url = '';
}

Exam.prototype.load = function (input) {
    var exam = input.exam;
    this.id = exam.id;
    this.teacher = exam.teacher;
    this.date = exam.date;
    
    var Qs = exam.questions;
    this.questions = processQuestions(Qs);
    this.answers = new Array();

}


function processQuestions(questions) {
    var Qs = new Array();
    var i;
    for(i = 0; i < questions.length; i++) {
        var Q = new Question();
        Q.number = i+1;
        Q.value = questions[i].value;
        Q.text = questions[i].text;
        var alineas = questions[i].alineas; 
        if(alineas !== undefined) {
            Q.alineas = processQuestions(alineas);
        }
        Qs.push(Q);
    } 

    return Qs;
}


Exam.prototype.render = function() {

}

Exam.prototype.formatPDF = function() {

}
*/


exports.Exam = Exam;