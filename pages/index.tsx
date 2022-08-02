import { Box, Typography, Link, Button } from "@mui/material";
import NextLink from "next/link";

export default function Home() {
  return (
    <Box
      my={4}
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
          <Typography component="h1" variant="h2" fontWeight={700}>
            ETD
          </Typography>
        </Link>
      </NextLink>
      <Typography component="h1" variant="h5">
        <b>E</b>asy <b>T</b>rainings <b>D</b>ocumentation
      </Typography>
      <NextLink href="/signup" passHref>
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
      </NextLink>
    </Box>
  );
}
