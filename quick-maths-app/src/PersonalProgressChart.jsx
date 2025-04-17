import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useDatabase } from "./DatabaseContext";
import { useEffect } from "react";
import dayjs from "dayjs";

function PersonalProgressChart() {
  const { getUserScores } = useDatabase();
  const [scores, setScores] = useState([]);
  const [data, setData] = useState([]);

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
        date: dayjs(score.created_at).format("YYYY-MM-DD HH:mm:ss"),
        score: score.score,
      }));
      setData(formattedData);
    }
  }, [scores]);

  return (
    <div>
      <h2>Personal Progress Chart</h2>
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid stroke="#444" height={300} />
        <XAxis dataKey="date" stroke="#8884d8" />
        <YAxis stroke="#8884d8" />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
}

export default PersonalProgressChart;
