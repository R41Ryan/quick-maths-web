import "./MainMenu.css";
import { useEffect, useRef, useState } from "react";
import { useDatabase } from "./DatabaseContext";
import { useGameSettings } from "./GameSettingContext";

function MainMenu({ setScreen }) {
  const { user, signOut, getProfile, getUserHighScore, getUserStreak } = useDatabase();

  const [profile, setProfile] = useState(null);
  const [userHighScore, setUserHighScore] = useState(null);
  const [userDailyStreak, setUserDailyStreak] = useState(0);

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
      <div className="game-selection">
        <button>Start game</button>
        <button onClick={() => setScreen("customGame")}>Custom game</button>
      </div>
    </div>
  );
}

export default MainMenu;
