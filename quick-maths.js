var operationChoice = document.querySelector("#operation-choice");
var gameInterface = document.querySelector("#game-interface");
var answerElement = document.querySelector(".answer");

var operand1;
var operand2;
var operation = "+";
var correctAnswer;
var score;
var startTime;
var timerIntervalId;

var inPlay = false;

function setQuestionText() {
  document.querySelector("#question").innerText =
    operand1 + " " + operation + " " + operand2;
};

function createQuestion() {
  operand1 = Math.floor(Math.random() * 50);
  operand2 = Math.floor(Math.random() * 50);
  switch (operation) {
    case "+":
      correctAnswer = operand1 + operand2;
      break;
    case "-":
      correctAnswer = operand1 - operand2;
      break;
    case "x":
      correctAnswer = operand1 * operand2;
      break;
    case "÷":
      var temp = operand1 * operand2;
      correctAnswer = operand1;
      operand1 = temp;
      break;
    default:
  }
};

function checkAnswer() {
  var answerElement = document.querySelector(".answer");
  if (answerElement.innerText == correctAnswer) {
    score++;
    setScoreText();
    answerElement.classList.add("correct");
    setTimeout(function () {
      answerElement.classList.remove("correct");
      createQuestion();
      setQuestionText();
      answerElement.innerText = "";
    }, 250);
  }
};

function setScoreText() {
  document.querySelector("#score").innerText = "Score: " + score;
};

function setTimerText() {
  var timeElapsed = Date.now() - startTime;
  var minutes = Math.floor(timeElapsed / 1000 / 60);
  var seconds = Math.floor(timeElapsed / 1000 - minutes * 60);
  document.querySelector("#timer").innerText =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
};

document.querySelector("html").addEventListener("keydown", function (event) {
  console.log(event.key);
  if (inPlay && !answerElement.classList.contains("correct")) {
    if (event.key >= "0" && event.key <= "9") {
      answerElement.innerText += event.key;
    } else if (event.key == "Backspace" || event.key == "Delete") {
      answerElement.innerText = answerElement.innerText.slice(0, -1);
    } else if (event.key == "-" && answerElement.innerText.length == 0) {
      answerElement.innerText += "-";
    }

    checkAnswer();
  }
});

var operationButtons = document.querySelectorAll("#operation-choice button");
for (let i = 0; i < operationButtons.length; i++) {
  operationButtons[i].addEventListener("click", function () {
    operation = operationButtons[i].innerText;
    inPlay = true;
    score = 0;
    operationChoice.remove();
    document.querySelector("main").appendChild(gameInterface);
    startTime = Date.now();
    setTimerText();
    timerIntervalId = setInterval(setTimerText, 1000);
    createQuestion();
    setQuestionText();
    setScoreText();
  });
};

var mainMenuButtons = document.querySelectorAll(".back-to-main-menu-btn");
for (let i = 0; i < mainMenuButtons.length; i++) {
  mainMenuButtons[i].addEventListener("click", function () {
    inPlay = false;
    gameInterface.remove();
    document.querySelector("main").appendChild(operationChoice);
    clearInterval(timerIntervalId);
  });
};

var numpadButtons = document.querySelectorAll(".num");
for (let i = 0; i < numpadButtons.length; i++) {
  numpadButtons[i].addEventListener("click", function () {
    if (!answerElement.classList.contains("correct")) {
      answerElement.innerText += numpadButtons[i].innerText;
    }
    checkAnswer();
  });
};
document.querySelector(".minus").addEventListener("click", function () {
  if (answerElement.innerText.length == 0) {
    answerElement.innerText = "-";
  }
});
document.querySelector(".delete").addEventListener("click", function () {
  answerElement.innerText = answerElement.innerText.slice(0, -1);
});

gameInterface.remove();
