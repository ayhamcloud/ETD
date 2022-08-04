import { server } from "../../config";
import {
  Button,
  TextField,
  Grid,
  CircularProgress,
  Box,
  Container,
  Typography,
  Alert,
} from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import { object, string } from "yup";
import WorkoutCard from "../../components/sessions/WorkoutCard";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { format, parseISO } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

const NewSession = ({ sessions }) => {
  const router = useRouter();
  let lastSession = sessions[0];

  const addSession = async (values: any) => {
    const _date = zonedTimeToUtc(
      values.session_date.replace("T", " "),
      "Europe/Berlin"
    );
    const newSession = {
      date: _date,
      name: values.session_training,
      exercises: [],
    };
    sessions.unshift(newSession);
    const res = await fetch("/api/sessions/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSession),
    });
    const data = await res.json();
    return data;
  };

  const addSession_ = async (values) => {
    const { id } = await addSession(values);
    router.push(`/sessions/exercises?id=${id}`);
  };

  console.log(sessions);
  lastSession = sessions[0];
  var curr = new Date();
  curr.setDate(curr.getDate());
  const date = format(parseISO(curr.toISOString()), "yyyy-MM-dd'T'HH:mm");
  return (
    <Layout title={`ETD - Neues Workout`} sections={undefined}>
      <Container component="main" sx={{ mt: 3 }}>
        <Box
          sx={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Neues Workout
          </Typography>
          <Formik
            initialValues={{
              session_training: "",
              session_date: date,
            }}
            validationSchema={object({
              session_training: string().required("Training name is required"),
              session_date: string().required("Date is required"),
            })}
            onSubmit={(values) => {
              console.log(values);
              addSession_(values);
            }}
          >
            {({ isSubmitting, handleSubmit, handleReset }) => (
              <Box
                component="form"
                onSubmit={handleSubmit}
                onReset={handleReset}
                sx={{ mt: 1, width: "100%" }}
              >
                <ErrorMessage name="session_training">
                  {(msg) => <Alert severity="warning">{msg}</Alert>}
                </ErrorMessage>
                <Field
                  margin="normal"
                  required
                  fullWidth
                  type="text"
                  name="session_training"
                  as={TextField}
                  label="Training"
                />
                <ErrorMessage name="session_date">
                  {(msg) => <Alert severity="warning">{msg}</Alert>}
                </ErrorMessage>
                <Field
                  margin="normal"
                  required
                  fullWidth
                  type="datetime-local"
                  name="session_date"
                  as={TextField}
                  label="Datum"
                />
                <Button
                  fullWidth={true}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Erstellen"}
                </Button>
              </Box>
            )}
          </Formik>
          {lastSession ? (
            <Grid container>
              <Grid item sx={{ width: "100%", mt: 5 }}>
                <WorkoutCard session={lastSession} defaultExpand={false} modifiable={false}/>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const cookie = ctx.req.headers.cookie;
  const data = await fetch(`${server}/api/sessions`, {
    headers: {
      cookie: cookie,
    },
  });
  if (data.status === 404) {
    return {
      props: {
        sessions: [],
      },
    };
  }
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
  const json = await data.json();
  const sessions = json.sessions;
  return {
    props: {
      sessions,
    },
  };
};

export default NewSession;
