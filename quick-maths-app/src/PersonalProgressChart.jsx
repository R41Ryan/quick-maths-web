import "./PersonalProgressChart.css"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import { useDatabase } from "./DatabaseContext";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import dayjs from "dayjs";

function PersonalProgressChart({ setScreen }) {
  const { getUserScores } = useDatabase();
  const [scores, setScores] = useState([]);
  const [data, setData] = useState([]);

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  const chartWidth = isMobile ? 300 : 600;

  useEffect(() => {
    async function fetchScores() {
      const results = await getUserScores();
      if (results) {
        setScores(results);
      }
    }

    fetchScores();
  }, []);

  useEffect(() => {
    if (scores.length > 0) {
      const formattedData = scores.map((score) => ({
        date: dayjs(score.created_at).format("YYYY-MM-DD"),
        score: score.score,
      }));
      setData(formattedData);
    }
  }, [scores]);

  return (
    <div id="personal-progress-chart">
      <h2>Personal Progress Chart</h2>
      {scores.length <= 0 ? (
        <h3>No Scores Available</h3>
      ) : (
        <div className="chart-container">
          <div className="chart-inner">
            <LineChart
              width={chartWidth}
              height={300}
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid stroke="#000000" height={300} vertical={false} />
              <XAxis dataKey="date" stroke="#000000">
                <Label
                  value="Date"
                  offset={-10}
                  position="insideBottom"
                  fill="#000000"
                />
              </XAxis>
              <YAxis stroke="#000000">
                <Label
                  value="Score"
                  offset={-10}
                  position="insideLeft"
                  fill="#000000"
                />
              </YAxis>
              <Line
                type="monotone"
                dataKey="score"
                stroke="#000000"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </div>
        </div>
      )}
      <button className="back-to-main-menu-btn" onClick={() => setScreen("mainMenu")}>Back to Main Menu</button>
    </div>
  );
}

export default PersonalProgressChart;
