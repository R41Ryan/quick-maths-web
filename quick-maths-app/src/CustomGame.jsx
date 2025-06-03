import { useEffect, useState } from "react";
import { useGameSettings } from "./GameSettingContext";

function CustomGame({ setScreen }) {
    const {
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
        setDefaults
    } = useGameSettings();

    const [message, setMessage] = useState("");

    function handleOperationSelection(operation) {
        const newSet = new Set(operations)
        if (operations.has(operation)) {
            newSet.delete(operation)
        } else {
            newSet.add(operation);
        }
        setOperations(newSet);
    }

    function handleStartGame() {
        if (operations.size > 0) {
            if (minRange > maxRange) {
                let temp = minRange;
                setMinRange(maxRange);
                setMaxRange(temp);
            }

            setScreen("gameInterface");
        } else {
            setMessage("Please select at least 1 operation");
        }
    }

    function handleSetMinRange(e) {
        const value = e.target.value;
        const integersOnlyRegex = /^\d*$/;
        if (integersOnlyRegex.test(value)) {
            setMinRange(Number(value));
        }
    }

    function handleSetMaxRange(e) {
        const value = e.target.value;
        const integersOnlyRegex = /^\d*$/;
        if (integersOnlyRegex.test(value)) {
            setMaxRange(Number(value));
        }
    }

    function handleSetHasNegatives(e) {
        const value = e.target.checked;
        setHasNegatives(value);
    }

    function handleSetTimed(e) {
        const value = e.target.checked;
        setTimed(value);
    }

    function handleSetTotalTime(e) {
        const value = e.target.value;
        if (value === "" || value >= 0) {
            setTotalTime(Number(e.target.value));
        }
    }

    function handleSetHasGoal(e) {
        const value = e.target.checked;
        setHasGoal(value);
    }

    function handleSetGoalCount(e) {
        const value = e.target.value;
        if (value === "" || value >= 0) {
            setGoalCount(e.target.value);
        }
    }

    useEffect(() => {
        setDefaults();
    }, [])

    return (
        <div className="custom-game">
            <h2>Create Custom Game</h2>
            <h2>Choose operations to play</h2>
            <div id="operation-choice">
                <button onClick={() => handleOperationSelection("+")} id="addition" className={operations.has("+") ? "selected" : ""}>
                    +
                </button>
                <button onClick={() => handleOperationSelection("-")} id="subtraction" className={operations.has("-") ? "selected" : ""}>
                    -
                </button>
                <button
                    onClick={() => handleOperationSelection("x")}
                    id="multiplication"
                    className={operations.has("x") ? "selected" : ""}
                >
                    x
                </button>
                <button onClick={() => handleOperationSelection("÷")} id="division" className={operations.has("÷") ? "selected" : ""}>
                    ÷
                </button>
                <p>{message}</p>
            </div>
            <button className="start-game-button" onClick={handleStartGame}>Start game</button>
            <div id="settings">
                <h2>Settings</h2>
                <div className=".setting min-range">
                    <label>Min Range: </label>
                    <input
                        type="text"
                        value={minRange}
                        step="1"
                        onChange={handleSetMinRange}
                    />
                </div>
                <div className=".setting max-range">
                    <label>Max Range: </label>
                    <input
                        type="text"
                        value={maxRange}
                        step="1"
                        onChange={handleSetMaxRange}
                    />
                </div>
                <div className=".setting negatives">
                    <label>Allow Negatives? </label>
                    <input
                        type="checkbox"
                        checked={hasNegatives}
                        onChange={handleSetHasNegatives}
                    />
                </div>
                <div className=".setting timed">
                    <label>Timed? </label>
                    <input type="checkbox" checked={timed} onChange={handleSetTimed} />
                </div>
                <div className={`.setting timer ${timed ? "" : "hidden"}`}>
                    <label>How much (seconds)? </label>
                    <input
                        type="number"
                        value={totalTime}
                        step="1"
                        onChange={handleSetTotalTime}
                    />
                </div>
                <div className=".setting goal">
                    <label>Goal Count? </label>
                    <input
                        type="checkbox"
                        checked={hasGoal}
                        onChange={handleSetHasGoal}
                    />
                </div>
                <div className={`.setting count ${hasGoal ? "" : "hidden"}`}>
                    <label>How many question? </label>
                    <input
                        type="number"
                        value={goalCount}
                        step="1"
                        onChange={handleSetGoalCount}
                    />
                </div>
            </div>
            <button
                className="back-to-main-menu-btn"
                onClick={() => setScreen("mainMenu")}
            >
                Back to Main Menu
            </button>
        </div>
    );
}

export default CustomGame;