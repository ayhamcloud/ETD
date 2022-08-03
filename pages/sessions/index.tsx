// import { server } from "../../config";
import Layout from "../../components/Layout";
import { Box, Button, Grid, Pagination, Typography } from "@mui/material";
import WorkoutCard from "../../components/sessions/WorkoutCard";
// import NextLink from "next/link";
// import { useRouter } from "next/router";
// import { useState } from "react";

function SessionsList({ sessions, pages }) {
  // const router = useRouter();
  // const [pageState, setPageState] = useState(1);
  return (
    //   // eslint-disable-next-line react/no-children-prop
    <Layout title="ETD - Workouts" sections={undefined}>
      <Grid container>
        <Grid item sx={{ width: "100%", textAlign: "center", mt: 10 }}>
          <Typography variant="h5" component="h2">
            Noch keine Workouts vorhanden.
          </Typography>
        </Grid>

        <Grid item sx={{ width: "100%", textAlign: "center", mt: 10 }}>
          <Typography variant="h5" component="h2">
            {/* <NextLink href="/sessions/new" as="/sessions/new" passHref> */}
            <Button variant="contained" color="primary" size="large">
              Füge ein Workout hinzu, um fortzufahren.
            </Button>
            {/* </NextLink> */}
          </Typography>
        </Grid>
        
      </Grid>
    </Layout>
  );
}

export default SessionsList;
