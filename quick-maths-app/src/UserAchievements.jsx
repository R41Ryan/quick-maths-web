import { useAchievementTracker } from "./AchievementTrackerContext";
import "./UserAchievements.css";

function UserAchievements({ setScreen }) {
  const { achievementDefinitions, userAchievements } = useAchievementTracker();

  return (
    <div className="user-achievements">
      <h2>User Achievements</h2>
      <div className="achievement-list">
        {(achievementDefinitions === null) ? (
          <p>Loading...</p>
        ) : (
          achievementDefinitions.map((achievement) => {
            const isAchieved = userAchievements.some(
              (ua) => ua.achievement_id === achievement.id
            );
            return (
              <div
                key={achievement.id}
                className={`achievement-item ${isAchieved ? "achieved" : ""}`}
              >
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
              </div>
            );
          })
        )}
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

export default UserAchievements;
