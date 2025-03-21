var mainMenu = document.querySelector("#main-menu");
var gameInterface = document.querySelector("#game-interface");
var answerElement = document.querySelector(".answer");
var minRangeInput = document.querySelector(".min-range input");
var maxRangeInput = document.querySelector(".max-range input");
var timedInput = document.querySelector(".timed input");
var timerSetting = document.querySelector(".timer");
var timerInput = document.querySelector(".timer input");

var operand1;
var operand2;
var operation = "+";
var correctAnswer;
var score;
var startTime;
var isTimed; // These two vars are used for when the user wants to be timed
var endTime; // They are not used if the user does not check the "Timed?" checkbox
var timerIntervalId;
var minRange;
var maxRange;

var inPlay = false;

function setQuestionText() {
  document.querySelector("#question").innerText =
    operand1 + " " + operation + " " + operand2;
};

function createQuestion() {
  operand1 = Math.floor(Math.random() * (maxRange - minRange) + minRange);
  operand2 = Math.floor(Math.random() * (maxRange - minRange) + minRange);
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
  let timerElement = document.querySelector("#timer");
  let timeToBeDisplayed;
  if (isTimed) {
    timeToBeDisplayed = endTime - Date.now();

  } else {
    timeToBeDisplayed = Date.now() - startTime;
  }
  timeToBeDisplayed = Math.max(0, timeToBeDisplayed);
  let minutes = Math.floor(timeToBeDisplayed / 1000 / 60);
  let seconds = Math.floor(timeToBeDisplayed / 1000 - minutes * 60);
  timerElement.innerText =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  
};

function checkTime() {
  if (isTimed) {
    if (Date.now() >= endTime) {
      gameOver();
    }
  }
  setTimerText();
}

function setRanges() {
  minRange = Math.floor(Number(minRangeInput.value));
  maxRange = Math.floor(Number(maxRangeInput.value));
  if (minRange > maxRange) {
    let temp = minRange;
    minRange = maxRange;
    maxRange = temp;
  }
};

function gameOver() {
  inPlay = false;
  document.querySelector("html").classList.add("game-over");
  answerElement.innerText = "Game Over";
  clearInterval(timerIntervalId);
}

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

// This is where you put code for starting a game session
var operationButtons = document.querySelectorAll("#operation-choice button");
for (let i = 0; i < operationButtons.length; i++) {
  operationButtons[i].addEventListener("click", function () {
    operation = operationButtons[i].innerText;
    inPlay = true;
    score = 0;
    mainMenu.classList.add("removed");
    gameInterface.classList.remove("removed");

    startTime = Date.now();
    isTimed = timedInput.checked;
    if (isTimed) {
      endTime = startTime + Number(timerInput.value) * 1000;
    }
    setTimerText();
    timerIntervalId = setInterval(checkTime, 250);

    setRanges();
    createQuestion();
    setQuestionText();
    setScoreText();
  });
};

var mainMenuButtons = document.querySelectorAll(".back-to-main-menu-btn");
for (let i = 0; i < mainMenuButtons.length; i++) {
  mainMenuButtons[i].addEventListener("click", function () {
    inPlay = false;
    document.querySelector("html").classList.remove("game-over");
    gameInterface.classList.add("removed");
    mainMenu.classList.remove("removed");
    clearInterval(timerIntervalId);
  });
};

timedInput.addEventListener("click", function () {
  if (timedInput.checked) {
    timerSetting.classList.remove("hidden");
  } else {
    timerSetting.classList.add("hidden");
  }
});

timerInput.addEventListener("input", function () {
  timerInput.value = Math.abs(Math.floor(Number(timerInput.value)));
})

// Number pad stuff
var numpadButtons = document.querySelectorAll(".num");
for (let i = 0; i < numpadButtons.length; i++) {
  numpadButtons[i].addEventListener("click", function () {
    if (inPlay && !answerElement.classList.contains("correct")) {
      answerElement.innerText += numpadButtons[i].innerText;
    }
    checkAnswer();
  });
};
document.querySelector(".minus").addEventListener("click", function () {
  if (inPlay && answerElement.innerText.length == 0) {
    answerElement.innerText = "-";
  }
});
document.querySelector(".delete").addEventListener("click", function () {
  if (inPlay) {
    answerElement.innerText = answerElement.innerText.slice(0, -1);
  }
});

timerSetting.classList.add("hidden");
gameInterface.classList.add("removed");
