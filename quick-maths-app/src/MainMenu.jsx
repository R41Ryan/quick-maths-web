import "./MainMenu.css";
import { useEffect, useRef, useState } from "react";
import { useDatabase } from "./DatabaseContext";
import { useGameSettings } from "./GameSettingContext";

function MainMenu({ setScreen }) {
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
  } = useGameSettings();

  const { user, signOut, getProfile, getUserHighScore, getUserStreak } = useDatabase();

  const [profile, setProfile] = useState(null);
  const [userHighScore, setUserHighScore] = useState(null);
  const [userDailyStreak, setUserDailyStreak] = useState(0);
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
    async function fetchProfile() {
      if (user != null) {
        const profileData = await getProfile();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    }

    fetchProfile();
  }, [user]);

  useEffect(() => {
    async function fetchUserHighScore() {
      if (profile != null) {
        const userHighScoreData = await getUserHighScore();
        if (userHighScoreData != null) {
          setUserHighScore(userHighScoreData);
        } else {
          setUserHighScore(null);
        }
      }
    }

    async function fetchUserDailyStreak() {
      if (profile != null) {
        setUserDailyStreak(await getUserStreak());
      }
    }

    fetchUserHighScore();
    fetchUserDailyStreak();
  }, [profile])

  return (
    <div id="main-menu">
      <button
        className="global-options"
        onClick={() => setScreen("globalScoreDisplay")}
      >
        View Global High Scores
      </button>
      {user != null && profile != null && (
        <div>
          <h2>Welcome, {profile.display_name}</h2>
          <div className="user-high-score-display">
            <div>Your personal high score</div>
            <h3>{userHighScore ? userHighScore.score : "N/A"}</h3>
          </div>
          <div className="user-streak-display">
            <div>Your daily streak</div>
            <h3>{userDailyStreak}</h3>
          </div>
          <div className="profile-options">
            <button onClick={() => setScreen("personalScoreDisplay")}>
              View Personal Scores
            </button>
            <button onClick={() => setScreen("personalProgressChart")}>
              View Personal Progress Chart
            </button>
            <button onClick={() => setScreen("profileSettings")}>Profile Settings</button>
            <button onClick={() => signOut()}>Sign Out</button>
          </div>
        </div>
      )}
      {user != null && profile == null && (
        <div>
          <h2>Loading...</h2>
        </div>
      )}
      {user == null && (
        <div className="profile-options">
          <button onClick={() => setScreen("signUp")}>Sign Up</button>
          <button onClick={() => setScreen("signIn")}>Sign In</button>
        </div>
      )}
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
    </div>
  );
}

export default MainMenu;
