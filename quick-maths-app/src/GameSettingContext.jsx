import { createContext, useContext, useState } from "react";

const GameSettingContext = createContext();

export function GameSettingProvider({ children }) {
  const [operations, setOperations] = useState(new Set());
  const [minRange, setMinRange] = useState(0);
  const [maxRange, setMaxRange] = useState(10);
  const [hasNegatives, setHasNegatives] = useState(false);
  const [timed, setTimed] = useState(false);
  const [totalTime, setTotalTime] = useState(60);
  const [hasGoal, setHasGoal] = useState(false);
  const [goalCount, setGoalCount] = useState(100);
  const [isCustom, setIsCustom] = useState(false);

  const difficultySettings = [
    {
      operations: new Set(["+"]),
      minRange: 0,
      maxRange: 10,
      hasNegatives: false
    },
    {
      operations: new Set(["+", "-"]),
      minRange: 0,
      maxRange: 20,
      hasNegatives: false
    },
    {
      operations: new Set(["+", "-", "x"]),
      minRange: 0,
      maxRange: 20,
      hasNegatives: true
    },
    {
      operations: new Set(["+", "-", "x"]),
      minRange: 0,
      maxRange: 50,
      hasNegatives: true
    },
    {
      operations: new Set(["+", "-", "x", "÷"]),
      minRange: 0,
      maxRange: 100,
      hasNegatives: true
    }
  ]

  function setDefaults() {
    setOperations(new Set());
    setMinRange(0);
    setMaxRange(10);
    setHasNegatives(false);
    setTimed(false);
    setTotalTime(60);
    setHasGoal(false);
    setGoalCount(100);
    setIsCustom(true);
  }

  function setInitialStandard() {
    setDifficulty(0);
    setTimed(true);
    setTotalTime(60);
    setHasGoal(false);
    setGoalCount(100);
    setIsCustom(false);
  }

  function setDifficulty(difficultyLevel) {
    if (difficultyLevel < 0) {
      difficultyLevel = 0;
    }
    if (difficultyLevel >= difficultySettings.length) {
      difficultyLevel = difficultySettings.length - 1;
    }

    setOperations(difficultySettings[difficultyLevel].operations);
    setMinRange(difficultySettings[difficultyLevel].minRange);
    setMaxRange(difficultySettings[difficultyLevel].maxRange);
    setHasNegatives(difficultySettings[difficultyLevel].hasNegatives);
  }

  return (
    <GameSettingContext.Provider
      value={{
        operations,
        setOperations,
        minRange,
        setMinRange,
        maxRange,
        setMaxRange,
        hasNegatives,
        setHasNegatives,
        timed,
        setTimed,
        totalTime,
        setTotalTime,
        hasGoal,
        setHasGoal,
        goalCount,
        setGoalCount,
        isCustom,
        setIsCustom,
        setDefaults,
        setInitialStandard,
        setDifficulty
      }}
    >
      {children}
    </GameSettingContext.Provider>
  );
};

export function useGameSettings() {
    return useContext(GameSettingContext);
};