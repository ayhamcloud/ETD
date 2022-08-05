import { LineChartCard } from "../../../components/sessions/Charts";
import {
  getExerciseById,
  getExerciseStat,
  getReps,
} from "../../../utils/session";
import Layout from "../../../components/Layout";
import { format, parseISO } from "date-fns";
import { Grid } from "@mui/material";

const ExerciseStat = ({ exercises, chartData }) => {
  return (
    <Layout title={`ETD - ${exercises[0].name}`} sections={undefined}>
      <Grid
        container
        spacing={3}
        // direction={matches ? "column" : "row"}
        wrap="nowrap"
        sx={{ mt: 1 }}
      >
        <Grid item sx={{ width: "100%" }} xs={12}>
          <LineChartCard data={chartData} title={exercises[0].name} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query;
  // console.log(slug);
  const { exercises, status } = await getExerciseById(ctx, slug);
  if (status === 401) {
    return {
      redirect: {
        destination: `/login?next=sessions/${slug}`,
        permanent: false,
      },
    };
  } else if (status === 404) {
    return {
      redirect: {
        destination: "/sessions",
        permanent: false,
      },
    };
  }
  const n = getExerciseStat(exercises);
  console.log(n);
  const labels = exercises.map((exercise) =>
    format(parseISO(exercise.createdAt), "yyyy-MM-dd")
  );
  const chartData = {
    labels: labels.reverse(),
    datasets: [
      {
        label: "Total",
        data: n.map((exercise) => exercise.weights_sum).reverse(),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        pointRadius: 5,
        pointHitRadius: 10,
      },
    ],
  };
  return {
    props: { exercises, chartData },
  };
};

export default ExerciseStat;
