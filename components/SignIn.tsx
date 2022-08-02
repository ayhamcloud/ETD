import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Copyright from "../src/Copyright";
import { Formik, Field, ErrorMessage } from "formik";
import { object, string } from "yup";
import { Alert } from "@mui/material";
import Head from "next/head";

export default function SignIn({
  title,
  metaDescription,
  forgotPassword,
  noAccountYet,
  next,
  router,
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
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
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={object({
              email: string().email().required("Email is required"),
              password: string()
                .required("Password is required")
                .min(8, "Password is invalid"),
            })}
            onSubmit={async (values, formikHelpers) => {
              const res = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
              });
              const data = await res.json();
              console.log(data);
              // redirect to dashboard page
              if (data.loggedIn) {
                router.push(next || "/");
              }
              formikHelpers.setErrors({ Server: data.error } as any);
            }}
          >
            {({ errors, isSubmitting, handleSubmit, handleReset }) => (
              <Box
                component="form"
                onSubmit={handleSubmit}
                onReset={handleReset}
                sx={{ mt: 1, width: "100%" }}
              >
                {(errors as any).Server && (
                  <Alert severity="error">{(errors as any).Server}</Alert>
                )}
                <ErrorMessage name="email">
                  {(msg) => <Alert severity="warning">{msg}</Alert>}
                </ErrorMessage>
                <Field
                  margin="normal"
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  as={TextField}
                />
                <ErrorMessage name="password">
                  {(msg) => (
                    <Alert
                      severity="warning"
                      sx={{
                        width: "100%",
                      }}
                    >
                      {msg}
                    </Alert>
                  )}
                </ErrorMessage>
                <Field
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  as={TextField}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  Sign In
                </Button>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <NextLink href="/reset-password" passHref>
                      <Link variant="body2">{forgotPassword}</Link>
                    </NextLink>
                  </Grid>
                  <Grid item>
                    <NextLink href="/signup" passHref>
                      <Link variant="body2">{noAccountYet}</Link>
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
