import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import theme from "../../src/theme";
import LogoutIcon from "@mui/icons-material/Logout";
import PasswordIcon from '@mui/icons-material/Password';
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../utils/Store";
import { Field, Form, Formik } from "formik";
import WorkoutCard from "../sessions/WorkoutCard";
import {useRouter} from "next/router";
import CustDialog from "../../components/index/custDialog";

function SearchForm(props) {
  const { onClose, open } = props;
  const [results, setResults] = useState({});

  const handleClose = () => {
    onClose(open);
  };

  async function handleSubmit(values) {
    const response = await fetch("/api/sessions/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (response.status !== 200) {
      setResults({ error: "No results found" });
      return;
    }
    const data = await response.json();
    setResults(data);
  }

  return (
    <Dialog open={open}>
      <Formik
        initialValues={{ search: "" }}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ values, errors }) => (
          <Form>
            <DialogTitle>Search</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To Search for a speciific exercise or workout enter the name of
                the exercise or workout.
              </DialogContentText>
              <Field
                autoComplete="off"
                autoFocus
                as={TextField}
                margin="normal"
                name="search"
                label="Workout/Exercise Name"
                type="text"
                fullWidth
              />
              {results.error && <Alert severity="error">{results.error}</Alert>}
              <Box sx={{ mt: 2 }}>
                {results.sessions && (
                  <>
                    <Typography variant="h6" component="h3">
                      Sessions
                    </Typography>
                    <List>
                      {results.sessions.map((session) => (
                        <ListItem key={session.id}>
                          <WorkoutCard session={session} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {results.exercises && (
                  <>
                    <Typography variant="h6" component="h3">
                      Exercises
                    </Typography>
                    <List>
                      {results.exercises.map((exercise) => (
                        <ListItem key={exercise.id}>
                          <span>{exercise.name}</span>
                          <table style={{ textAlign: "center", width: "100%" }}>
                            <thead>
                              <tr>
                                {exercise.sets.map((set, index) => (
                                  <th key={index}>{set.reps}</th>
                                ))}
                                <th>x{exercise.sets.length}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {exercise.sets.map((set, index) => (
                                  <td key={index}>{set.weight}</td>
                                ))}
                                <td>kg</td>
                              </tr>
                            </tbody>
                          </table>
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
              <Button type="submit">
                <SearchIcon />
                Search
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

function ProfileDialog(props) {
  const { onClose, open } = props;

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <List>
        <ListItem button onClick={() => handleListItemClick("Logout")}>
          <ListItemAvatar>
            <LogoutIcon />
          </ListItemAvatar>
          <ListItemText primary="Logout" />
        </ListItem>
        <ListItem button onClick={() => handleListItemClick("reset-password")}>
          <ListItemAvatar>
            <PasswordIcon />
          </ListItemAvatar>
          <ListItemText primary="Change Password" />
        </ListItem>
      </List>
    </Dialog>
  );
}

function Header(props) {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { sections } = props;
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    userInfo && setLoggedIn(true);
  }, [userInfo]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async (value) => {
    setOpen(false);
    if (value === "Logout") {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        window.location = "/";
      }
    }
    if (value === "reset-password") {
      router.push("/reset-password", "/reset-password", { shallow: true });
    }
  };
  const handleSectionHighlight = (section) => {
    let background = "none";
    let text = "inherit";
    let onHoverColor = "inherit";
    if (document.location.pathname === section) {
      background = theme.palette.primary.main;
      text = theme.palette.primary.contrastText;
      onHoverColor = "#000";
    }
    return { background, text, onHoverColor };
  };

  const handleSearchClick = () => {
    setOpenSearch(true);
  };

  const handleSearchClose = () => {
    setOpenSearch(false);
  };

  return (
    <>
      <Toolbar
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          justifyContent: "space-between",
          overflowX: "auto",
        }}
      >
        <Typography component="h2" variant="h4" color="inherit" align="center">
          <NextLink href="/" as="/" passHref>
            <Link
              sx={{
                color: "text",
                textDecoration: "none",
                "&:hover": {
                  color: "secondary",
                },
              }}
            >
              ETD
            </Link>
          </NextLink>
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {!loggedIn ? (
            <>
              <NextLink href="/signup" passHref>
                <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                  Sign up
                </Button>
              </NextLink>
              <NextLink href="/login" passHref>
                <Button variant="contained" size="small">
                  Login
                </Button>
              </NextLink>
            </>
          ) : (
            <>
              <IconButton sx={{ mr: 1 }} onClick={handleSearchClick}>
                <SearchIcon />
              </IconButton>
              <SearchForm open={openSearch} onClose={handleSearchClose} />
              <Button
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
                onClick={handleClickOpen}
              >
                {userInfo}
              </Button>
              <CustDialog open={open} onClose={handleClose} listItems={[ { primary: "Logout", value: "Logout", }, { primary: "Change Password", value: "reset-password", } ]} />
            </>
          )}
        </Box>
      </Toolbar>
      {loggedIn ? (
        <Toolbar
          component="nav"
          variant="dense"
          sx={{
            justifyContent: "space-between",
            overflowX: "auto",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          {sections.map((section) => (
            <NextLink
              key={section.title}
              href={section.url}
              as={section.url}
              passHref
            >
              <Link
                color={theme.palette.text.secondary}
                noWrap
                variant="button"
                component={Button}
                sx={{
                  p: 1,
                  flexShrink: 0,
                  textDecoration: "none",
                  background: handleSectionHighlight(section.url).background,
                  color: handleSectionHighlight(section.url).text,
                  "&:hover": {
                    color: handleSectionHighlight(section.url).onHoverColor,
                  },
                }}
              >
                {section.title}
              </Link>
            </NextLink>
          ))}
        </Toolbar>
      ) : (
        <Toolbar></Toolbar>
      )}
    </>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
