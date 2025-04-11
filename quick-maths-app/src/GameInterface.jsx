import { useEffect, useReducer, useRef, useState } from "react";
import { useGameSettings } from "./GameSettingContext";
import { useAudio } from "./AudioContext";

function GameInterface({ setScreen }) {
  const { operation, minRange, maxRange, timed, totalTime, hasGoal, goalCount } =
    useGameSettings();

  const { audioFiles, playSound } = useAudio();

  const [operand1, setOperand1] = useState(
    Math.floor(Math.random() * (maxRange - minRange) + minRange)
  );
  const [operand2, setOperand2] = useState(
    Math.floor(Math.random() * (maxRange - minRange) + minRange)
  );
  let correctAnswer = NaN;
  let operand1Text = operand1;
  let operand2Text = operand2;
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
      operand1Text = String(operand1 * operand2);
      correctAnswer = operand1;
      break;
    default:
      const err = new Error(`Invalid Operation: ${operation}`);
      console.error("Error Message: ", err.message);
      console.error("Stack trace: ", err.stack);
      throw err;
  }
  const question = `${operand1Text} ${operation} ${operand2Text}`;

  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const endTime = useRef(Date.now() + totalTime * 1000)
  const startTime = useRef(Date.now());
  const [time, setTime] = useState(() => {
    let timeToBeDisplayed;
      if (timed) {
        timeToBeDisplayed = endTime.current - Date.now();
      } else {
        timeToBeDisplayed = Date.now() - startTime.current;
      }
      timeToBeDisplayed = Math.max(0, timeToBeDisplayed);
      let minutes = Math.floor(timeToBeDisplayed / 1000 / 60);
      let seconds = Math.floor(timeToBeDisplayed / 1000 - minutes * 60);
      return (
        String(minutes).padStart(2, "0") +
          ":" +
          String(seconds).padStart(2, "0")
      );
  });
  const canInput = useRef(true);
  const timerIntervalRef = useRef(null);
  const correctTimeoutRef = useRef(null);

  function createNewQuestion() {
    setOperand1(
      Math.floor(Math.random() * (maxRange - minRange + 1) + minRange)
    );
    setOperand2(
      Math.floor(Math.random() * (maxRange - minRange + 1) + minRange)
    );
  }

  function handleInputDigit(digit) {
    if (canInput.current) {
      playSound(audioFiles.inputDigit);
      setAnswer(`${answer}${digit}`);
    }
  }

  function handleToggleNegative() {
    if (canInput.current) {
      playSound(audioFiles.inputDigit);
      if (answer.length == 0) {
        setAnswer("-");
      } else {
        if (answer[0] == "-") {
          setAnswer(answer.slice(1));
        } else {
          setAnswer(`-${answer}`);
        }
      }
    }
  }

  function handleDeleteDigit() {
    if (answer.length > 0 && canInput.current) {
      playSound(audioFiles.deleteDigit);
      setAnswer(answer.slice(0, -1));
    }
  }

  function checkAnswer() {
    if (answer.length > 0 && Number(answer) == correctAnswer) {
      setCorrect(true);
    }
  }

  function handleTimeOut() {
    clearInterval(timerIntervalRef.current);
  }

  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      let timeToBeDisplayed;
      if (timed) {
        timeToBeDisplayed = endTime.current - Date.now();
      } else {
        timeToBeDisplayed = Date.now() - startTime.current;
      }
      timeToBeDisplayed = Math.max(0, timeToBeDisplayed);
      let minutes = Math.floor(timeToBeDisplayed / 1000 / 60);
      let seconds = Math.floor(timeToBeDisplayed / 1000 - minutes * 60);
      setTime(
        String(minutes).padStart(2, "0") +
          ":" +
          String(seconds).padStart(2, "0")
      );

      if (endTime.current - Date.now() < 0 && timed) {
        setGameOver(true);
      }
    }, 250);

    return () => clearInterval(timerIntervalRef.current);
  }, []);

  useEffect(() => {
    if (correct) {
      playSound(audioFiles.correct);
      canInput.current = false;
      setScore(score + 1);
      clearTimeout(correctTimeoutRef.current);
      correctTimeoutRef.current = setTimeout(() => {
        setCorrect(false);
        canInput.current = true;
        setAnswer("");
        createNewQuestion();
      }, 500);
    }
  }, [correct]);

  useEffect(() => {
    checkAnswer();
  }, [answer]);

  useEffect(() => {
    if (gameOver) {
      playSound(audioFiles.gameOver);
      document.querySelector("html").classList.add("game-over");
      clearInterval(timerIntervalRef.current);
    } else {
      document.querySelector("html").classList.remove("game-over");
    }

    return () => {
      document.querySelector("html").classList.remove("game-over");
    };
  });

  return (
    <div id="game-interface">
      <h2 id="timer">{time}</h2>
      <h2 id="score">Score: {score}</h2>
      <h2 id="question">{question}</h2>
      <h2 className={`answer ${correct ? "correct" : ""}`}>
        {gameOver ? "Game Over" : answer}
      </h2>
      <div className="numpad">
        <button className="num" onClick={() => handleInputDigit("7")}>
          7
        </button>
        <button className="num" onClick={() => handleInputDigit("8")}>
          8
        </button>
        <button className="num" onClick={() => handleInputDigit("9")}>
          9
        </button>
        <button className="num" onClick={() => handleInputDigit("4")}>
          4
        </button>
        <button className="num" onClick={() => handleInputDigit("5")}>
          5
        </button>
        <button className="num" onClick={() => handleInputDigit("6")}>
          6
        </button>
        <button className="num" onClick={() => handleInputDigit("1")}>
          1
        </button>
        <button className="num" onClick={() => handleInputDigit("2")}>
          2
        </button>
        <button className="num" onClick={() => handleInputDigit("3")}>
          3
        </button>
        <button className="minus" onClick={handleToggleNegative}>
          +/-
        </button>
        <button className="num zero" onClick={() => handleInputDigit("0")}>
          0
        </button>
        <button className="delete" onClick={handleDeleteDigit}>
          Del
        </button>
      </div>
      <button
        className="back-to-main-menu-btn"
        onClick={() => setScreen("mainMenu")}
      >
        Back to main menu
      </button>
    </div>
  );
}

export default GameInterface;
