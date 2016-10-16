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
}


function Exam() {
    this.student = new Student();
    this.id = '';
    this.questions = null; //array of questions;
    this.answers = null; //array of answers;
    this.url = '';
}

Exam.prototype.load = function () {

}

Exam.prototype.render = function() {

}

Exam.prototype.formatPDF = function() {

}

exports.Exam = Exam;