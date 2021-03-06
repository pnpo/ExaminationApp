//ES6

class Student {
    constructor() {
        this.name = '';
        this.number = -1;
    }
}

class Answer {
    constructor(){
        this.anum = -1; //alinea number
        this.qnum = -1; //question number
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
        this.discipline = '';
        this.type = '';
        this.course = '';
        this.disclaimer = '';
        this.date = '';
        this.id = '';
        this.questions = null; //array of questions;
        this.answers = null; //array of answers;
        this.url = '';
    }   

    _processQuestions(questions) {
        var Qs = new Array();
        var i;
        for(i = 0; i < questions.length; i++) {
            var Q = new Question();
            Q.number = i+1;
            Q.value = questions[i].value;
            Q.text = questions[i].text;
            var alineas = questions[i].alineas; 
            if(alineas !== undefined) {
                Q.alineas = this._processQuestions(alineas);
            }
            Qs.push(Q);
        } 

        return Qs;
    }

    static loadFromString(data){
        var exam = new Exam();
        var obj = JSON.parse(data).exam;
        exam.id = obj.id;
        exam.discipline = obj.discipline;
        exam.course = obj.course;
        exam.type = obj.type;
        exam.teacher = obj.teacher;
        exam.date = obj.date;
        exam.disclaimer = obj.disclaimer;
        
        var Qs = obj.questions;
        exam.questions = exam._processQuestions(Qs);
        exam.answers = new Array();

        return exam;
    }

    static loadFromExamObject(input) {
        var exam = new Exam();
        exam.student = input.student
        exam.teacher = input.teacher;
        exam.disclaimer = input.disclaimer;
        exam.date = input.date;
        exam.id = input.id;
        exam.discipline = input.discipline;
        exam.course = input.course;
        exam.type = input.type;
        exam.questions = input.questions;
        exam.answers = input.answers;
        exam.url = input.url;    

        return exam;
    }
    
}

exports.Answer = Answer;
exports.Exam = Exam;

