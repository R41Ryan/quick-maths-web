import { createContext, useContext, useEffect, useState } from "react";
import { useDatabase } from "./DatabaseContext";

const AchievementTrackerContext = createContext();

export const AchievementTrackerProvider = ({ children }) => {
  const { user, getUserHighScore, getUserStreak, getAllAchievementDefinitions, getUserAchievements, addUserAchievement } = useDatabase();
  const [achievementDefinitions, setAchievementDefinitions] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);

  const checkAchievemnts = async () => {
    const fetchUserAchievements = async () => {
      const achievements = await getUserAchievements();
      setUserAchievements(achievements);
    };

    if (!user) return;

    for (const achievement of achievementDefinitions) {
      const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
      if (!userAchievement) {
        switch (achievement.type) {
          case "highscore":
            const highScore = await getUserHighScore(user.id);
            if (highScore >= achievement.target) {
              addUserAchievement(achievement.id);
            }
            break;
          case "daily_streak":
            const streak = await getUserStreak(user.id);
            if (streak >= achievement.target) {
              addUserAchievement(achievement.id);
            }
            break;
          default:
            console.warn(`Unknown achievement type: ${achievement.type}`);
        }
      }
    }

    fetchUserAchievements();
  }

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
  }, [user]);

  return (
    <AchievementTrackerContext.Provider value={{achievementDefinitions, userAchievements, checkAchievemnts}}>
      {children}
    </AchievementTrackerContext.Provider>
  );
};

export const useAchievementTracker = () => {
  return useContext(AchievementTrackerContext);
};
