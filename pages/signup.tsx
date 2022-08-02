import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Copyright from "../src/Copyright";
import { Formik, Field, ErrorMessage } from "formik";
import { object, string } from "yup";
import { useRouter } from "next/router";
import Head from "next/head";

export default function SignUp() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>ETD - Sign Up</title>
        <meta name="description" content="Sign up to ETD" />
      </Head>
      <Container component="main" maxWidth="xs">
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
        </Box>
        <Box
          sx={{
            minHeight: "50vh",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4">
            Sign up
          </Typography>
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={object({
              name: string()
                .required("Name is required")
                .lowercase()
                .min(3, "Name must be at least 3 characters long"),
              email: string()
                .email()
                .required("Email is required")
                .lowercase("Email is invalid"),
              password: string()
                .required("Password is required")
                .min(8, "Password must be at least 8 characters long")
                .matches(
                  /(?=.*\d)(?=.*[a-z])(?=.*[~@#$€%^&*+=`|{}:;!.?\"()\[\]-])[\w~@#$€%^&*+=`|{}:;!.?\"()\[\]-]{8,}/,
                  "Password must contain at least one lowercase letter and one uppercase letter and one number and a special character"
                ),
            })}
            onSubmit={async (values, formikHelpers) => {
              const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
              });
              const data = await res.json();
              console.log(data);
              if (res.status !== 200) {
                formikHelpers.setErrors({ Server: data.message } as any);
              }
              // redirect to home page
              if (res.status === 200) {
                router.push("/verification/check-email");
              }
            }}
          >
            {({ errors, isSubmitting, handleSubmit, handleReset }) => (
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                onReset={handleReset}
                sx={{ mt: 3 }}
              >
                {(errors as any).Server && (
                  <Alert severity="error">{(errors as any).Server}</Alert>
                )}
                <Grid container spacing={1.5}>
                  <Grid item xs={12}>
                    <ErrorMessage name="name">
                      {(msg) => <Alert severity="warning">{msg}</Alert>}
                    </ErrorMessage>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      autoComplete="given-name"
                      name="name"
                      required
                      fullWidth
                      label="Full Name"
                      as={TextField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ErrorMessage name="email">
                      {(msg) => <Alert severity="warning">{msg}</Alert>}
                    </ErrorMessage>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      required
                      fullWidth
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      as={TextField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ErrorMessage name="password">
                      {(msg) => <Alert severity="warning">{msg}</Alert>}
                    </ErrorMessage>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      as={TextField}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  Click Here To Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <NextLink href="/login" passHref>
                      <Link variant="body2">
                        Already have an account? Log In
                      </Link>
                    </NextLink>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Formik>
        </Box>
        <Copyright />
      </Container>
    </>
  );
}
