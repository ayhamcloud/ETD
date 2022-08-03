import { Box, Typography, Link, Button } from "@mui/material";
import NextLink from "next/link";
import Head from "next/head";
import Copyright from "src/Copyright";

export default function Home() {
  return (
    <>
      <Head>
        <title>ETD - Start Page</title>
        <meta name="description" content="ETD Start Page" />
      </Head>
      <Box
        my={15}
        sx={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <NextLink href="/" passHref>
          <Link
            sx={{
              textDecoration: "none",
            }}
          >
            <Typography component="h1" variant="h1" fontWeight={700}>
              ETD
            </Typography>
          </Link>
        </NextLink>
        <Typography component="h1" variant="h2">
          <b>E</b>asy <b>T</b>rainings <b>D</b>ocumentation
        </Typography>
        <Typography component="h1" variant="subtitle1">
          The Best Place to Save Your Workouts and Visualize Your Progress!
        </Typography>
        <NextLink href="/signup" passHref>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 5, mb: 3 }}
            size="large"
          >
            Sign Up
          </Button>
        </NextLink>
        <NextLink href="/login" passHref>
          <Button
            type="submit"
            // fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
            size="large"
          // disabled={isSubmitting}
          >
            Log In
          </Button>
        </NextLink>
      </Box>
      <Copyright />
    </>
  );
}
