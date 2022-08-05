import { server } from "../../config";
import Layout from "../../components/Layout";
import { Box, Button, Grid, Pagination, Typography } from "@mui/material";
import WorkoutCard from "../../components/sessions/WorkoutCard";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

function SessionsList({ sessions, pages }) {
  const router = useRouter();
  const [pageState, setPageState] = useState(1);
  return (
    //   // eslint-disable-next-line react/no-children-prop
    <Layout title="ETD - Workouts" sections={undefined}>
      {sessions.length > 0 ? (
        <Grid
          container
          spacing={3}
          direction="column"
          alignItems="center"
          sx={{ mt: 1 }}
        >
          {sessions.map((session) => (
            <Grid item key={session.id} sx={{ width: "100%" }}>
              <WorkoutCard session={session} defaultExpand={false} modifiable />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container>
          <Grid item sx={{ width: "100%", textAlign: "center", mt: 10 }}>
            <Typography variant="h5" component="h2">
              No Workouts avaiable.
            </Typography>
          </Grid>
          <Grid item sx={{ width: "100%", textAlign: "center", mt: 10 }}>
            <Typography variant="h5" component="h2">
              <NextLink href="/sessions/new" as="/sessions/new" passHref>
                <Button variant="contained" color="primary" size="large">
                   Click Here To Create A Workout
                </Button>
              </NextLink>
            </Typography>
          </Grid>
        </Grid>
      )}
      {pages > 1 && (
        <Box mt={5}>
          <Pagination
            count={pages}
            showFirstButton
            showLastButton
            style={{
              display: "flex",
              justifyContent: "center",
            }}
            onChange={(e, page) => {
              if (page === 1) {
                router.push("/sessions", "/sessions", { scroll: false });
              } else {
                router.push(
                  `/sessions?page=${page - 1}`,
                  `/sessions?page=${page - 1}`,
                  { scroll: false }
                );
              }
              setPageState(page);
            }}
            page={pageState}
          />
        </Box>
      )}
    </Layout>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const { page } = ctx.query;
  const skipInt = page === 0 || !page ? 0 : parseInt(page);
  console.log(server);

  const data = await fetch(`${server}/api/sessions?skip=${skipInt}`, {
    headers: {
      cookie: ctx.req.headers.cookie,
    },
  });
  if (data.status === 401 && !ctx.req) {
    return {
      redirect: {
        destination: `/login?next=${ctx.req.url}`,
        permanent: false,
      },
    };
  }
  if (data.status === 401 && ctx.req) {
    return {
      redirect: {
        destination: `/login?next=${ctx.req.url}`,
        permanent: false,
      },
    };
  }
  if (data.status === 404) {
    return {
      props: {
        sessions: [],
      },
    };
  }
  const json = await data.json();
  const sessions = json.sessions;

  let pages = 0;
  if (sessions.length < json.count) {
    pages = Math.ceil(json.count / sessions.length);
  }

  return {
    props: {
      sessions,
      pages,
    },
  };
};

export default SessionsList;
