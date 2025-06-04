import { createContext, use, useContext, useEffect, useState } from "react";
import { useDatabase } from "./DatabaseContext";
import { useAudio } from "./AudioContext";
import "./AchievementTrackerContext.css";

const AchievementTrackerContext = createContext();

export const AchievementTrackerProvider = ({ children }) => {
  const {
    user,
    getUserHighScore,
    getUserStreak,
    getAllAchievementDefinitions,
    getUserAchievements,
    addUserAchievement,
  } = useDatabase();
  const { audioFiles, playSound } = useAudio();
  const [achievementDefinitions, setAchievementDefinitions] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const checkAchievements = async () => {
    const fetchUserAchievements = async () => {
      const achievements = await getUserAchievements();
      setUserAchievements(achievements);
    };

    if (!user) return;

    const newAchievements = [];

    for (const achievement of achievementDefinitions) {
      const userAchievement = userAchievements.find(
        (ua) => ua.achievement_id === achievement.id
      );
      if (!userAchievement) {
        switch (achievement.type) {
          case "highscore":
            const highScore = await getUserHighScore(user.id);
            if (highScore.score >= achievement.target) {
              await addUserAchievement(achievement.id);
              newAchievements.push(achievement);
            }
            break;
          case "daily_streak":
            const streak = await getUserStreak(user.id);
            if (streak >= achievement.target) {
              await addUserAchievement(achievement.id);
              newAchievements.push(achievement);
            }
            break;
          default:
            console.warn(`Unknown achievement type: ${achievement.type}`);
        }
      }
    }

    setRecentAchievements(newAchievements);

    fetchUserAchievements();
  };

  useEffect(() => {
    const fetchAchievementDefinitions = async () => {
      const definitions = await getAllAchievementDefinitions();
      setAchievementDefinitions(definitions);
    };

    const fetchUserAchievements = async () => {
      const achievements = await getUserAchievements();
      setUserAchievements(achievements);
    };

    fetchAchievementDefinitions();
    if (user) {
      fetchUserAchievements();
    }
  }, []);

  useEffect(() => {
    const fetchUserAchievements = async () => {
      const achievements = await getUserAchievements();
      setUserAchievements(achievements);
    };

    if (user) {
      fetchUserAchievements();
    }
  }, [user]);

  useEffect(() => {
    if (recentAchievements == null) return;
    if (recentAchievements.length === 0) return;
    setShowNotification(true);
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  }, [recentAchievements])

  useEffect(() => {
    if (!showNotification) return;
    playSound(audioFiles.achievementUnlock);
  }, [showNotification])

  return (
    <AchievementTrackerContext.Provider
      value={{ achievementDefinitions, userAchievements, checkAchievements }}
    >
      {children}
      <div className={`achievement-notification ${showNotification ? '' : 'hidden'}`}>
        {recentAchievements && recentAchievements.length > 0 && (
          <div className="recent-achievements">
            <h3>New Achievements Unlocked!</h3>
            <ul>
              {recentAchievements.map((achievement) => (
                <li key={achievement.id}>
                  {achievement.name}: {achievement.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AchievementTrackerContext.Provider>
  );
};

export const useAchievementTracker = () => {
  return useContext(AchievementTrackerContext);
};
