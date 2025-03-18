var operationChoice = document.querySelector("#operation-choice");
var gameInterface = document.querySelector("#game-interface");

var operand1
var operand2
var operation = '+'
var correctAnswer
var score;

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
        case '÷':
            var temp = operand1 * operand2;
            correctAnswer = operand1;
            operand1 = temp
            break;
        default:
    }
}

function checkAnswer() {
    var answerElement = document.querySelector(".answer");
    if (answerElement.innerHTML == correctAnswer) {
        score++;
        setScoreText();
        answerElement.classList.add("correct");
        setTimeout(function() {
            answerElement.classList.remove("correct");
            createQuestion();
            setQuestionText();
            answerElement.innerHTML = "";
        }, 250);
    }
}

function setScoreText() {
    document.querySelector("#score").innerHTML = "Score: " + score
}

document.querySelector("html").addEventListener("keydown", function (event) {
    console.log(event.key);
    var answerElement = document.querySelector(".answer");
    if (inPlay && !answerElement.classList.contains("correct")) {
        if (event.key >= '0' && event.key <= '9') {
            answerElement.innerText += event.key
        } else if (event.key == 'Backspace' || event.key == 'Delete') {
            answerElement.innerHTML = answerElement.innerHTML.slice(0, -1);
        } else if (event.key == '-' && answerElement.innerHTML.length == 0) {
            answerElement.innerHTML += '-';
        }

        checkAnswer();
    }
})

var operationButtons = document.querySelectorAll("#operation-choice button");
for (let i = 0; i < operationButtons.length; i++) {
    operationButtons[i].addEventListener("click", function() {
        operation = operationButtons[i].innerHTML;
        inPlay = true;
        score = 0;
        operationChoice.remove();
        document.querySelector("main").appendChild(gameInterface)
        createQuestion();
        setQuestionText();
        setScoreText();
    });
}

var mainMenuButtons = document.querySelectorAll(".back-to-main-menu-btn");
for (let i = 0; i < mainMenuButtons.length; i++) {
    mainMenuButtons[i].addEventListener("click", function() {
        inPlay = false;
        gameInterface.remove();
        document.querySelector("main").appendChild(operationChoice);
    });
}

gameInterface.remove();