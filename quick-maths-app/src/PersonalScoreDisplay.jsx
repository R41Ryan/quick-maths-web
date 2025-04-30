import "./PersonalScoreDisplay.css";
import { useEffect, useRef, useState } from "react";
import { useDatabase } from "./DatabaseContext";

function PersonalScoreDisplay({ setScreen }) {
  const { user, getUserScores, deleteScore } = useDatabase();
  const [personalScores, setPersonalScores] = useState([]);
  const sortMethod = useRef("date");

  function sortScoresByDate(a, b) {
    return new Date(b.created_at) - new Date(a.created_at);
  }

  function sortScoresByDateReverse(a, b) {
    return new Date(a.created_at) - new Date(b.created_at);
  }

  function handleSortByDate() {
    if (sortMethod.current !== "date") {
      const sortedScores = [...personalScores].sort(sortScoresByDate);
      setPersonalScores(sortedScores);
      sortMethod.current = "date";
    } else {
      const sortedScores = [...personalScores].sort(sortScoresByDateReverse);
      setPersonalScores(sortedScores);
      sortMethod.current = "dateReverse";
    }
  }

  function handleSortByTime() {
    if (sortMethod.current !== "time") {
      const sortedScores = [...personalScores].sort((a, b) => b.time_seconds - a.time_seconds);
      setPersonalScores(sortedScores);
      sortMethod.current = "time";
    } else {
      const sortedScores = [...personalScores].sort((a, b) => a.time_seconds - b.time_seconds);
      setPersonalScores(sortedScores);
      sortMethod.current = "timeReverse";
    }
  }

  function handleSortByScore() {
    if (sortMethod.current !== "score") {
      const sortedScores = [...personalScores].sort((a, b) => b.score - a.score);
      setPersonalScores(sortedScores);
      sortMethod.current = "score";
    } else {
      const sortedScores = [...personalScores].sort((a, b) => a.score - b.score);
      setPersonalScores(sortedScores);
      sortMethod.current = "scoreReverse";
    }
  }

  function handleDeleteScore(scoreId) {
    deleteScore(scoreId).then(() => {
      setPersonalScores((prevScores) => prevScores.filter((score) => score.id !== scoreId));
    });
  }

  useEffect(() => {
    async function fetchScores() {
      if (user) {
        const scores = await getUserScores();
        setPersonalScores(scores);
      }
    }
    fetchScores();
  }, []);

  return (
    <div className="personal-score-display">
      <h2>Your Scores</h2>
      <table>
        <thead>
          <tr>
            <th onClick={handleSortByScore}>Score</th>
            <th onClick={handleSortByTime}>Time (seconds)</th>
            <th onClick={handleSortByDate}>Date and Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {personalScores.length > 0 &&
            personalScores.map((item, index) => (
              <tr key={index}>
                <td>{item.score}</td>
                <td>{item.time_seconds}</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td><button onClick={() => handleDeleteScore(item.id)}>Delete</button></td>
              </tr>
            ))}
          {personalScores.length === 0 && (
            <tr>
              <td colSpan="4">No scores available.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="back-to-main-menu-btn" onClick={() => setScreen("mainMenu")}>Back to Main Menu</button>
    </div>
  );
}

export default PersonalScoreDisplay;
