import { useState } from "react";
import { useGameSettings } from "./GameSettingContext";
import { useAudio } from "./AudioContext";

function GameInterface({ setScreen }) {
  const { operation, minRange, maxRange, timed, endTime, hasGoal, goalCount } =
    useGameSettings();

  const { audioFiles, playSound } = useAudio();

  const [ operand1, setOperand1 ] = useState(Math.floor(Math.random() * (maxRange - minRange) + minRange));
  const [ operand2, setOperand2 ] = useState(Math.floor(Math.random() * (maxRange - minRange) + minRange));
  const question = `${operand1} ${operation} ${operand2}`;

  const [ answer, setAnswer ] = useState("");
  const [ time, setTime ] = useState("0:00");
  const [ score, setScore ] = useState(0);
  const [ correct, setCorrect ] = useState(false);

  function createNewQuestion() {
    setOperand1(Math.floor(Math.random() * (maxRange - minRange) + minRange));
    setOperand2(Math.floor(Math.random() * (maxRange - minRange) + minRange));
  }

  function handleInputDigit(digit) {
    playSound(audioFiles.inputDigit);
    setAnswer(`${answer}${digit}`);
  }

  function handleToggleNegative() {
    playSound(audioFiles.inputDigit);
    if (answer.length == 0) {
        setAnswer("-");
    } else {
        if (answer[0] == '-') {
            setAnswer(answer.slice(1));
        } else {
            setAnswer(`-${answer}`);
        }
    }
  }

  function handleDeleteDigit() {
    if (answer.length > 0) {
        playSound(audioFiles.deleteDigit);
        setAnswer(answer.slice(0, -1));
    }
  }

  return (
    <div id="game-interface">
      <h2 id="timer">{time}</h2>
      <h2 id="score">Score: {score}</h2>
      <h2 id="question">{question}</h2>
      <h2 className={`answer ${correct ? "correct" : ""}`}>{answer}</h2>
      <div className="numpad">
        <button className="num" onClick={() => handleInputDigit("7")}>7</button>
        <button className="num" onClick={() => handleInputDigit("8")}>8</button>
        <button className="num" onClick={() => handleInputDigit("9")}>9</button>
        <button className="num" onClick={() => handleInputDigit("4")}>4</button>
        <button className="num" onClick={() => handleInputDigit("5")}>5</button>
        <button className="num" onClick={() => handleInputDigit("6")}>6</button>
        <button className="num" onClick={() => handleInputDigit("1")}>1</button>
        <button className="num" onClick={() => handleInputDigit("2")}>2</button>
        <button className="num" onClick={() => handleInputDigit("3")}>3</button>
        <button className="minus" onClick={handleToggleNegative}>+/-</button>
        <button className="num zero" onClick={() => handleInputDigit("0")}>0</button>
        <button className="delete" onClick={handleDeleteDigit}>Del</button>
      </div>
      <button className="back-to-main-menu-btn" onClick={() => setScreen("mainMenu")}>Back to main menu</button>
    </div>
  );
}

export default GameInterface;
