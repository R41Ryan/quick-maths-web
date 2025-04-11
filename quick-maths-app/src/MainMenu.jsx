import { useState } from "react";
import { useGameSettings } from "./GameSettingContext";

function MainMenu({ setScreen }) {
  const {
    setOperation,
    minRange,
    setMinRange,
    maxRange,
    setMaxRange,
    timed,
    setTimed,
    totalTime,
    setTotalTime,
    hasGoal,
    setHasGoal,
    goalCount,
    setGoalCount,
  } = useGameSettings();

  function handleOperationSelection(operation) {
    if (minRange > maxRange) {
      let temp = minRange;
      setMinRange(maxRange);
      setMaxRange(temp);
    }
    setOperation(operation);
    setScreen("gameInterface");
  }

  function handleSetMinRange(e) {
    const value = e.target.value;
    const integersOnlyRegex = /^-?\d*$/;
    if (integersOnlyRegex.test(value)) {
      setMinRange(Number(value));
    };
  }

  function handleSetMaxRange(e) {
    const value = e.target.value;
    const integersOnlyRegex = /^-?\d*$/;
    if (integersOnlyRegex.test(value)) {
      setMaxRange(Number(value));
    };
  }

  function handleSetTimed(e) {
    const value = e.target.checked;
    setTimed(value);
  }

  function handleSetTotalTime(e) {
    const value = e.target.value;
    if (value === '' || value >= 0) {
      setTotalTime(Number(e.target.value));
    }
  }

  function handleSetHasGoal(e) {
    const value = e.target.checked;
    setHasGoal(value);
  }

  function handleSetGoalCount(e) {
    const value = e.target.value;
    if (value === '' || value >= 0) {
      setGoalCount(e.target.value);
    }
  }

  return (
    <div id="main-menu">
      <div id="operation-choice">
        <h2>Choose operation to play</h2>
        <button onClick={() => handleOperationSelection("+")} id="addition">+</button>
        <button onClick={() => handleOperationSelection("-")} id="subtraction">-</button>
        <button onClick={() => handleOperationSelection("x")} id="multiplication">x</button>
        <button onClick={() => handleOperationSelection("÷")} id="division">÷</button>
      </div>
      <div id="settings">
        <h2>Settings</h2>
        <div className=".setting min-range">
          <label>Min Range: </label>
          <input type="text" value={minRange} step="1" onChange={handleSetMinRange} />
        </div>
        <div className=".setting max-range">
          <label>Max Range: </label>
          <input type="text" value={maxRange} step="1" onChange={handleSetMaxRange} />
        </div>
        <div className=".setting timed">
          <label>Timed? </label>
          <input type="checkbox" checked={timed} onChange={handleSetTimed} />
        </div>
        <div className={`.setting timer ${timed ? "" : "hidden"}`}>
          <label>How much (seconds)? </label>
          <input type="number" value={totalTime} step="1" onChange={handleSetTotalTime} />
        </div>
        <div className=".setting goal">
          <label>Goal Count? </label>
          <input type="checkbox" checked={hasGoal} onChange={handleSetHasGoal}/>
        </div>
        <div className={`.setting count ${hasGoal ? "" : "hidden"}`}>
          <label>How many question? </label>
          <input type="number" value={goalCount} step="1" onChange={handleSetGoalCount} />
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
