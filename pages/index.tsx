import Layout from "../components/Layout";
import Grid from "@mui/material/Grid";
import GitHubIcon from "@mui/icons-material/GitHub";
import MainFeaturedPost from "../components/index/MainFeaturedPost";
import Sidebar from "../components/index/Sidebar";
import Main from "../components/index/Main";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const mainFeaturedPost = {
  title: "Welcome to ETD",
  description: `ETD - Easy Trainings Documentation is the best place to document
    your workouts and visualize your progress in each exercise.`,
  imageText: "main image description",
};

const sidebar = {
  title: "About",
  description:
    "ETD was created with simplicity in mind. It is a simple way to document your workouts and visualize your progress to help you improve your performance.",
  social: [
    { name: "GitHub", icon: GitHubIcon, url: "https://github.com/ayham291" },
  ],
};

export default function Home(props) {
  return (
    <Layout title="ETD - Home">
      <MainFeaturedPost post={mainFeaturedPost} />
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Main title="What is new in ETD" posts={props.posts} />
        <Sidebar
          title={sidebar.title}
          description={sidebar.description}
          social={sidebar.social}
        />
      </Grid>
    </Layout>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync(path.join("_posts"));
  const posts = files.map((post) => {
    const slug = post.replace(".md", "");
    const metaMd = fs.readFileSync(path.join("_posts", post), "utf8");
    const { data } = matter(metaMd);
    return {
      slug,
      data,
    };
  });

  return {
    props: {
      posts,
    },
  };
}
