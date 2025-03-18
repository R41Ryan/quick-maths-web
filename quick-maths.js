var operand1
var operand2
var operation = '+'
var correctAnswer

var inPlay = false

function setQuestionText() {
    document.querySelector("#question").innerText = operand1 + " " + operation + " " + operand2;
}

function createQuestion() {
    operand1 = Math.floor(Math.random() * 50);
    operand2 = Math.floor(Math.random() * 50);
    switch (operation) {
        case '+':
            correctAnswer = operand1 + operand2;
            break;
        case '-':
            correctAnswer = operand1 - operand2;
            break;
        case 'x':
            correctAnswer = operand1 * operand2;
            break;
        case '/':
            var temp = operand1 * operand2;
            correctAnswer = operand1;
            operand1 = temp
            break;
    }
}

function checkAnswer() {
    var answerElement = document.querySelector("#answer");
    var userAnswer = parseInt(answerElement.innerHTML);
    if (answerElement.innerHTML == correctAnswer) {
        console.log("Correct!");
        createQuestion();
        setQuestionText();
        answerElement.innerHTML = "";
    }
}

document.querySelector("html").addEventListener("keydown", function (event) {
    console.log(event.key);
    var answerElement = document.querySelector("#answer");
    if (inPlay) {
        if (event.key >= '0' && event.key <= '9') {
            answerElement.innerText += event.key
        } else if (event.key == 'Backspace' || event.key == 'Delete') {
            answerElement.innerHTML = answerElement.innerHTML.slice(0, -1);
        } else if (event.key == '-' && answerElement.innerHTML.length == 0) {
            answerElement.innerHTML += '-';
        }

        checkAnswer();
    } else {
        inPlay = true;
        operation = '+';
        createQuestion();
        setQuestionText();
    }
})