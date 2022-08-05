import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Title,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);
import { Card, Typography, useMediaQuery } from "@mui/material";
import theme from "../../src/theme";

export const ChartCard = ({ data, title }) => {
  const matches = useMediaQuery("(max-width:1200px)");
  return (
    <Card
      sx={{
        maxWidth: `${!matches && "31vw"}`,
        backgroundColor: theme.palette.card.main,
        padding: "1rem",
        borderRadius: 5,
      }}
    >
      <Typography variant="h4">{title}</Typography>
      <div style={{ height: "60vh" }}>
        <Doughnut
          data={data}
          options={{ responsive: true, maintainAspectRatio: false }}
          height={400}
          width={400}
        />
      </div>
    </Card>
  );
};

export const LineChartCard = ({ data, title }) => {
  return (
    <Card
      sx={{
        backgroundColor: theme.palette.card.main,
        padding: "1rem",
        borderRadius: 5,
      }}
    >
      <Typography variant="h4">{title}</Typography>
      <div style={{ height: "60vh" }}>
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
          height={400}
          width={400}
        />
      </div>
    </Card>
  );
};
