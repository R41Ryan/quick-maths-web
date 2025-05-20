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

  function setDefaults() {
    setOperations(new Set());
    setMinRange(0);
    setMaxRange(10);
    setHasNegatives(false);
    setTimed(false);
    setTotalTime(60);
    setHasGoal(false);
    setGoalCount(100);
  }

  function setInitialStandard() {
    setOperations(new Set("+", "-", "x", "÷"));
    setMinRange(0);
    setMaxRange(100);
    setHasNegatives(true);
    setTimed(true);
    setTotalTime(60);
    setHasGoal(false);
    setGoalCount(100);
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
        setDefaults,
        setInitialStandard
      }}
    >
      {children}
    </GameSettingContext.Provider>
  );
};

export function useGameSettings() {
    return useContext(GameSettingContext);
};