import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Copyright from "../../src/Copyright";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { PrismaClient } from "@prisma/client";
import { useEffect, useState } from "react";
import { Zoom } from "@mui/material";
import { verify } from "jsonwebtoken";
import NextLink from "next/link";
import { sendEmail } from "../../utils/sendmail";
import { useSnackbar } from "notistack";

export default function CheckMail({ user }) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setLoading(true);
    }
  }, [user]);

  /** 
  * Wenn die Email noch nicht verifiziert wwurde, dreht sich die Sanduhr
  * die ganze Zeit, im 3 Sekunden Takt.
  */
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
              We sent you an email with a link to verify your email address.
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

  /** 
   * Wenn die Email verifiziert wurde, wird man zur verified Seite Weitergeleitet.
  */

  const verified = (
    <>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Zoom
              in={loading}
              style={{ transitionDelay: loading ? "500ms" : "0ms" }}
            >
              <CheckCircleIcon fontSize="large" />
            </Zoom>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Typography variant="body1">
              Your email address has been verified. You can now login.
            </Typography>
          </Box>
        </Grid>
        <Grid item container xs={12} spacing={1} sx={{ width: "100%" }}>
          <Grid item xs={12}></Grid>
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
    <Container component="main" maxWidth="xs">
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
      <Copyright />
    </Container>
  );
}

export const getServerSideProps = async (ctx) => {
  const { token } = ctx.query;
  const prisma = new PrismaClient();
  const cookies_token = ctx.req.cookies.token;
  if (!token && !cookies_token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  if (cookies_token) {
    const { pending, userId } = verify(cookies_token, process.env.JWT_SECRET || "");
    const user_before = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!pending || !user_before?.pending) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  }

  if (!token) {
    return {
      props: {
        user: null,
      },
    };
  }

  const decoded = verify(token, process.env.JWT_SECRET || "");
  const uid = decoded.userId;

  const user = await prisma.user.findUnique({
    where: {
      id: uid,
    },
  });
  if (user?.pending === false) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const updated_user = await prisma.user.update({
    where: {
      id: uid,
    },
    data: {
      pending: false,
    },
  });

  if (updated_user.pending === false) {
    sendEmail(updated_user.email);
  }

  return {
    props: {
      user: user.id,
    },
  };
};


