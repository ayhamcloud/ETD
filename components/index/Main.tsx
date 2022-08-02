import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { format } from "date-fns";
import NextLink from "next/link";
import { Box, Link } from "@mui/material";

function Main(props) {
  const { posts, title } = props;

  return (
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        "& .post": {
          py: 3,
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider />
      {posts.map((post, index) => (
        <Box className="post" key={index}>
          <NextLink href={`/posts/${post.slug}`} passHref>
            <Link
              variant="h4"
              component="h1"
              sx={{
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
                textDecoration: "none",
              }}
              gutterBottom
            >
              {post.data.title}
            </Link>
          </NextLink>
          <Typography variant="body1" sx={{ fontStyle: "italic" }} gutterBottom>
            {format(new Date(post.data.date), "MMMM dd, yyyy")} by{" "}
            <NextLink href={`/users/${post.data.author.name}`} passHref>
              <Link>{post.data.author.name}</Link>
            </NextLink>
          </Typography>
          <Typography variant="body1" gutterBottom>
            {post.data.excerpt}
          </Typography>
        </Box>
      ))}
    </Grid>
  );
}

Main.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
};

export default Main;
