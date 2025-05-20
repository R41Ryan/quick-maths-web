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
  const [goalCount, setGoalCount] = useState(10);

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
      }}
    >
      {children}
    </GameSettingContext.Provider>
  );
};

export function useGameSettings() {
    return useContext(GameSettingContext);
};