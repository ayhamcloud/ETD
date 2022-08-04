import { getLastRelatedSession, getSessionById } from "../../../utils/session";
import { Box, Grid, Typography } from "@mui/material";
import Layout from "../../../components/Layout";
import EditWorkoutCard from "../../../components/sessions/EditWorkoutCard";
import WorkoutCard from "../../../components/sessions/WorkoutCard";

function EditSession({ session, lastRelatedSession }) {
  return (
    <Layout title={`Editing ${session.name}`} sections={undefined}>
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Typography component="h1" variant="h4">
          Editing Workout
        </Typography>
        <Grid
          container
          spacing={3}
          direction="column"
          alignItems="center"
          sx={{ mt: 1 }}
        >
          <Grid item sx={{ width: "100%" }}>
            <EditWorkoutCard session={session} defaultExpand />
          </Grid>
          {lastRelatedSession ? (
            <Grid item sx={{ width: "100%" }}>
              <WorkoutCard session={lastRelatedSession} modifiable={false} defaultExpand={undefined} />
            </Grid>
          ) : null}
        </Grid>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { id } = ctx.query;
  if (!id) {
    return {
      redirect: {
        destination: "/sessions/",
        permanent: false,
      },
    };
  }

  const { session, status } = await getSessionById(ctx, id);
  const { lastRelatedSession } = await getLastRelatedSession(ctx, id);
  if (status !== 200) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session, lastRelatedSession },
  };
}

export default EditSession;
