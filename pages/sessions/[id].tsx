import { ChartCard } from "../../components/sessions/Charts";
import { getReps, getSessionById } from "../../utils/session";
import Layout from "../../components/Layout";
import WorkoutCard from "../../components/sessions/WorkoutCard";
import { Grid, useMediaQuery } from "@mui/material";

const Session = ({ session, chartData }) => {
  const matches = useMediaQuery("(max-width:1200px)");
  return (
    <Layout title={`ETD - ${session.name}`} sections={undefined}>
      <Grid container spacing={3} direction={matches ? "column" : "row"} wrap="nowrap" sx={{ mt: 1}}>
        <Grid item sx={{ width: "100%" }}>
          <WorkoutCard session={session} defaultExpand={true} modifiable={true} overview={true}/>
        </Grid>
        <Grid item sx={{ width: "100%" }}>
          <ChartCard data={chartData} title="Wiederholungen" />
        </Grid>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const { session, status } = await getSessionById(ctx, id);
  if (status === 401) {
    return {
      redirect: {
        destination: `/login?next=sessions/${id}`,
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
  const n = getReps(session);
  const chartData = {
    labels: n.map((exercise) => exercise.exercise.name),
    datasets: [
      {
        data: [...n.map((exercise) => exercise.reps_sum)],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FA6002",
          "#23A0AB",
          "#AFCE47",
          "#AF6004",
          "#06F2E0",
          "#EE0E56",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FA6002",
          "#23A0AB",
          "#AFCE47",
          "#AF6004",
          "#06F2E0",
          "#EE0E56",
        ],
      },
    ],
  };
  return {
    props: { session, chartData },
  };
};

export default Session;
