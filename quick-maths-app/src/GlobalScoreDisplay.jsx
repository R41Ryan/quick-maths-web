import "./GlobalScoreDisplay.css";
import { useEffect, useRef, useState } from "react";
import { useDatabase } from "./DatabaseContext";

function GlobalScoreDisplay({ setScreen }) {
  const { user, getAllScores } = useDatabase();
  const [globalScores, setGlobalScores] = useState([]);
  const sortMethod = useRef("score");

  function sortScoresByDate(a, b) {
    return new Date(b.created_at) - new Date(a.created_at);
  }

  function sortScoresByDateReverse(a, b) {
    return new Date(a.created_at) - new Date(b.created_at);
  }

  function handleSortByDate() {
    if (sortMethod.current !== "date") {
      const sortedScores = [...globalScores].sort(sortScoresByDate);
      setGlobalScores(sortedScores);
      sortMethod.current = "date";
    } else {
      const sortedScores = [...globalScores].sort(sortScoresByDateReverse);
      setGlobalScores(sortedScores);
      sortMethod.current = "dateReverse";
    }
  }

  function handleSortByTime() {
    if (sortMethod.current !== "time") {
      const sortedScores = [...globalScores].sort((a, b) => b.time_seconds - a.time_seconds);
      setGlobalScores(sortedScores);
      sortMethod.current = "time";
    } else {
      const sortedScores = [...globalScores].sort((a, b) => a.time_seconds - b.time_seconds);
      setGlobalScores(sortedScores);
      sortMethod.current = "timeReverse";
    }
  }

  function handleSortByScore() {
    if (sortMethod.current !== "score") {
      const sortedScores = [...globalScores].sort((a, b) => b.score - a.score);
      setGlobalScores(sortedScores);
      sortMethod.current = "score";
    } else {
      const sortedScores = [...globalScores].sort((a, b) => a.score - b.score);
      setGlobalScores(sortedScores);
      sortMethod.current = "scoreReverse";
    }
  }

  useEffect(() => {
    async function fetchScores() {
        const scores = await getAllScores();
        setGlobalScores(scores);
    }
    fetchScores();
  }, []);

  return (
    <div className="global-score-display">
      <h2>Global Scores</h2>
      <table>
        <thead>
          <tr>
            <th onClick={handleSortByScore}>Score</th>
            <th onClick={handleSortByTime}>Time (seconds)</th>
            <th onClick={handleSortByDate}>Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {globalScores.length > 0 &&
            globalScores.map((item, index) => (
              <tr key={index}>
                <td>{item.score}</td>
                <td>{item.time_seconds}</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
              </tr>
            ))}
          {globalScores.length === 0 && (
            <tr>
              <td colSpan="3">No scores available.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => setScreen("mainMenu")}>Back to Main Menu</button>
    </div>
  );
}

export default GlobalScoreDisplay;