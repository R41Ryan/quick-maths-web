import { useEffect, useRef, useState } from "react";
import { useGameSettings } from "./GameSettingContext";
import { useAudio } from "./AudioContext";
import { useDatabase } from "./DatabaseContext";

function GameInterface({ setScreen }) {
  const {
    operation,
    minRange,
    maxRange,
    hasNegatives,
    timed,
    totalTime,
    hasGoal,
    goalCount,
  } = useGameSettings();

  const { audioFiles, playSound } = useAudio();

  const { user, insertScore } = useDatabase();

  const [operand1, setOperand1] = useState(() => {
    let operand = Math.floor(
      Math.random() * (maxRange - minRange + 1) + minRange
    );
    if (hasNegatives) {
      operand = Math.random() < 0.5 ? -operand : operand;
    }
    return operand;
  });
  const [operand2, setOperand2] = useState(() => {
    let operand = Math.floor(
      Math.random() * (maxRange - minRange + 1) + minRange
    );
    if (hasNegatives) {
      operand = Math.random() < 0.5 ? -operand : operand;
    }
    return operand;
  });
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
  const [gameWin, setGameWin] = useState(false);
  const [savedScore, setSavedScore] = useState(false);

  const endTime = useRef(Date.now() + totalTime * 1000);
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
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    );
  });
  const canInput = useRef(true);
  const timerIntervalRef = useRef(null);
  const correctTimeoutRef = useRef(null);

  function createNewQuestion() {
    setOperand1(() => {
      let operand = Math.floor(
        Math.random() * (maxRange - minRange + 1) + minRange
      );
      if (hasNegatives) {
        operand = Math.random() < 0.5 ? -operand : operand;
      }
      return operand;
    });
    setOperand2(() => {
      let operand = Math.floor(
        Math.random() * (maxRange - minRange + 1) + minRange
      );
      if (hasNegatives) {
        operand = Math.random() < 0.5 ? -operand : operand;
      }
      return operand;
    });
  }

  function handleInputDigit(digit) {
    if (canInput.current) {
      playSound(audioFiles.inputDigit);
      setAnswer((prev) => `${prev}${digit}`);
    }
  }

  function handleToggleNegative() {
    if (canInput.current) {
      playSound(audioFiles.inputDigit);
      setAnswer((prev) => {
        if (prev.length == 0) {
          return "-";
        } else {
          if (prev[0] == "-") {
            return prev.slice(1);
          } else {
            return `-${prev}`;
          }
        }
      });
    }
  }

  function handleDeleteDigit() {
    playSound(audioFiles.deleteDigit);
    setAnswer((prev) => prev.slice(0, -1));
  }

  function checkAnswer() {
    if (answer.length > 0 && Number(answer) == correctAnswer) {
      setCorrect(true);
    }
  }

  function handleSaveScore() {
    if (user) {
      insertScore(score, Math.floor((Date.now() - startTime.current) / 1000));
      setSavedScore(true);
    }
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

    function handleKeyDown(event) {
      if (event.key >= "0" && event.key <= "9") {
        handleInputDigit(String(event.key));
      } else if (event.key == "Backspace" || event.key == "Delete") {
        handleDeleteDigit();
      } else if (event.key == "-") {
        handleToggleNegative();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(timerIntervalRef.current);
    };
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
      }, 250);
    }
  }, [correct]);

  useEffect(() => {
    if (score >= goalCount && hasGoal) {
      setGameWin(true);
    }
  }, [score]);

  useEffect(() => {
    checkAnswer();
  }, [answer]);

  useEffect(() => {
    if (gameOver) {
      canInput.current = false;
      playSound(audioFiles.gameOver);
      document.querySelector("html").classList.add("game-over");
      clearInterval(timerIntervalRef.current);
      clearTimeout(correctTimeoutRef.current);
    } else {
      document.querySelector("html").classList.remove("game-over");
    }

    return () => {
      document.querySelector("html").classList.remove("game-over");
    };
  }, [gameOver]);

  useEffect(() => {
    if (gameWin) {
      canInput.current = false;
      playSound(audioFiles.gameWin);
      document.querySelector("html").classList.add("game-win");
      clearInterval(timerIntervalRef.current);
      clearTimeout(correctTimeoutRef.current);
    } else {
      document.querySelector("html").classList.remove("game-win");
    }

    return () => {
      document.querySelector("html").classList.remove("game-win");
    };
  }, [gameWin]);

  return (
    <div id="game-interface">
      <h2 id="timer">{time}</h2>
      <h2 id="score">Score: {score}</h2>
      <h2 id="question">{question}</h2>
      <h2 className={`answer ${correct ? "correct" : ""}`}>
        {gameOver ? "Game Over" : gameWin ? "You Win!" : answer}
      </h2>
      {gameWin && !savedScore && user && (<button onClick={handleSaveScore}>Save Score?</button>)}
      {gameWin && savedScore && user && (<h3>Saved Score!</h3>)}
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
