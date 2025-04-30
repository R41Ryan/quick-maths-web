import "./MainMenu.css";
import { useEffect, useRef, useState } from "react";
import { useDatabase } from "./DatabaseContext";
import { useGameSettings } from "./GameSettingContext";

function MainMenu({ setScreen }) {
  const {
    setOperation,
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

  const { user, signOut, getProfile } = useDatabase();

  const [profile, setProfile] = useState(null);

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

  return (
    <div id="main-menu">
      <button
        className="global-options"
        onClick={() => setScreen("globalScoreDisplay")}
      >
        View Global Scores
      </button>
      {user != null && profile != null && (
        <div>
          <h2>Welcome, {profile.display_name}</h2>
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
      <div id="operation-choice">
        <h2>Choose operation to play</h2>
        <button onClick={() => handleOperationSelection("+")} id="addition">
          +
        </button>
        <button onClick={() => handleOperationSelection("-")} id="subtraction">
          -
        </button>
        <button
          onClick={() => handleOperationSelection("x")}
          id="multiplication"
        >
          x
        </button>
        <button onClick={() => handleOperationSelection("÷")} id="division">
          ÷
        </button>
      </div>
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
