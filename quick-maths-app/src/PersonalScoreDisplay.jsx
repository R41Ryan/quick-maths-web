import { useEffect, useState } from "react";
import { useDatabase } from "./DatabaseContext";

function PersonalScoreDisplay({ setScreen }) {
  const { user, getUserScores } = useDatabase();
  const [personalScores, setPersonalScores] = useState([]);

  useEffect(() => {
    async function fetchScores() {
      if (user) {
        const scores = await getUserScores();
        setPersonalScores(scores);
      }
    }
    fetchScores();
  });

  return (
    <div className="personal-score-display">
      <h2>Your Scores</h2>
      <table>
        <thead>
          <tr>
            <th>Score</th>
            <th>Time (seconds)</th>
            <th>Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {personalScores.length > 0 && (personalScores.map((item, index) => (
            <tr key={index}>
              <td>{item.score}</td>
              <td>{item.time_seconds}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
            </tr>
          )))}
          {personalScores.length === 0 && (
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

export default PersonalScoreDisplay;
