import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Copyright from "../src/Copyright";
import { useRouter } from "next/router";
import { useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { object, string } from "yup";
import { Alert } from "@mui/material";
import Head from "next/head";
import { verify, JwtPayload } from "jsonwebtoken";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import { useSnackbar } from "notistack";

function FormBeforEmail({ setSent }) {
  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={object({
        email: string().email().required("Email is required"),
      })}
      onSubmit={async (values, formikHelpers) => {
        const res = await fetch("/api/users/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        console.log(data);
        formikHelpers.setErrors({ Server: data.error } as any);
        setSent(true);
      }}
    >
      {({ values, errors, isSubmitting, handleSubmit, handleReset }) => (
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            disabled={isSubmitting}
          >
            Send Email
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <NextLink href="/signup" passHref>
                <Link variant="body2">Don&apos;t have an account? Sign Up</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      )}
    </Formik>
  );
}

function FormAfterEmail() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik
      initialValues={{ password: "" }}
      validationSchema={object({
        password: string()
          .required("Password is required")
          .min(8, "Password must be at least 8 characters long")
          .matches(
            /(?=.*\d)(?=.*[a-zA-Z])(?=.*[~@#$€%^&*+=`|{}:;!.?\"()\[\]-])[\w~@#$€%^&*+=`|{}:;!.?\"()\[\]-]{8,}/,
            "Password must contain at least one lowercase letter and one uppercase letter and one number and a special character"
          ),
      })}
      onSubmit={async (values, formikHelpers) => {
        const res = await fetch("/api/users/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: document.URL.split("?")[1].split("=")[1],
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (res.ok && data.updated) {
          enqueueSnackbar("Password Updated", { variant: "success" });
          router.push("/login", "/login", { shallow: true });
        } else {
          enqueueSnackbar(data.error, { variant: "error" });
          formikHelpers.setErrors({ Server: data.error } as any);
        }
      }}
    >
      {({ values, errors, isSubmitting, handleSubmit, handleReset }) => (
        <Box
          component="form"
          onSubmit={handleSubmit}
          onReset={handleReset}
          sx={{ mt: 1, width: "100%" }}
        >
          {(errors as any).Server && (
            <Alert severity="error">{(errors as any).Server}</Alert>
          )}
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
            label="Password"
            name="password"
            autoComplete="current-password"
            type="password"
            as={TextField}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <NextLink href="/signup" passHref>
                <Link variant="body2">Don&apos;t have an account? Sign Up</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      )}
    </Formik>
  );
}

export default function ResetPassword({ resetpw }) {
  const [sent, setSent] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const check = (
    <>
      <Typography component="h1" variant="h5">
        Check your email
      </Typography>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <HourglassFullIcon
              fontSize="large"
              sx={{
                animation: "spin 3s linear infinite",
                "@keyframes spin": {
                  from: { transform: "rotate(0deg)" },
                  to: { transform: "rotate(360deg)" },
                },
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Typography variant="body1">
              We sent you an email with a link to reset your password.
            </Typography>
            <Typography variant="body1">
              If you don&apos;t see the email, check your spam folder.
            </Typography>
            <Typography variant="body1">
              If you still don&apos;t see it, click the button below to resend
              the email.
            </Typography>
          </Box>
        </Grid>
        <Grid item container xs={12} spacing={1} sx={{ width: "100%" }}>
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  const res = await fetch("/api/verification/resend-email", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  if (res.status === 200) {
                    enqueueSnackbar("Email sent", {
                      variant: "success",
                    });
                  } else {
                    enqueueSnackbar("Error Email has not been sent!", {
                      variant: "error",
                    });
                  }
                }}
              >
                Resend email
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center" }}>
              <NextLink href="/login" passHref>
                <Button variant="outlined" color="primary">
                  Login
                </Button>
              </NextLink>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
  return (
    <>
      <Head>
        <title>ETD - Reset Password</title>
        <meta name="description" content="Sign in to ETD" />
      </Head>
      <Container component="main" maxWidth="xs">
        {sent ? (
          <Box
            sx={{
              minHeight: "80vh",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {check}
          </Box>
        ) : (
          <>
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
                {!resetpw
                  ? "Send an email to reset password"
                  : "Type your new password"}
              </Typography>
              {resetpw ? (
                <FormAfterEmail />
              ) : (
                <FormBeforEmail setSent={setSent} />
              )}
            </Box>
            <Copyright />
          </>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const { token } = ctx.query;
  if (!token) {
    return {
      props: {
        resetpw: false,
      },
    };
  }

  const decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;
  if (!decoded) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      resetpw: decoded.resetpw || false,
    },
  };
};
