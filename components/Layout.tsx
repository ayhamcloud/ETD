import Container from "@mui/material/Container";
import Header from "../components/index/Header";
import Footer from "../components/index/Footer";
import Head from "next/head";

const DefaultSections = [
  { title: "Workouts", url: "/sessions" },
  { title: "Create Workout", url: "/sessions/new" },
];

export default function Layout({ children, title, sections }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Container maxWidth="lg">
        {sections ? (
          <Header title={title} sections={sections} />
        ) : (
          <Header title={title} sections={DefaultSections} />
        )}
        {children}
      </Container>
      <Footer />
    </>
  );
}
