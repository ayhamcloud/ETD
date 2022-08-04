import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { Delete, Edit } from "@mui/icons-material";
import { getWeight } from "../../utils/session";
import {
  Autocomplete,
  InputAdornment,
  Link,
  TextField,
  useMediaQuery,
} from "@mui/material";
import theme from "../../src/theme";
import NextLink from "next/link";
import { format, parseISO } from "date-fns";
import DeleteDialog from "../dialogs/DeleteDialog";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Container, Grid } from "@mui/material";
import { Formik, Field, FieldArray, ErrorMessage, Form } from "formik";
import RemoveIcon from "@mui/icons-material/Remove";
import AbcIcon from "@mui/icons-material/Abc";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import NumbersIcon from "@mui/icons-material/Numbers";
import { useSnackbar } from "notistack";
import cuid from "cuid";
import useSWR from "swr";
import { useRouter } from "next/router";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CustomizedTooltips from "../buttons/Tooltip";
import CloudDoneIcon from "@mui/icons-material/CloudDone";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));
const Hr = styled("hr")({
  border: "0",
  height: "1px",
  background: "#333",
  backgroundImage: "linear-gradient(to right, #ccc, #333, #ccc)",
  width: "100%",
});
const DivForTable = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  flexWrap: "wrap",
  alignItems: "center",
});
const AddMore = styled((props) => {
  const { children, ...other } = props;
  return (
    <Button type="button" {...other}>
      {children}
    </Button>
  );
})(({ theme }) => ({
  marginLeft: "auto",
  marginRight: theme.spacing(1),
}));

function ExerciseForm({
  session,
  exercise,
  setForm,
  setFetchAgain,
  setInitialValues,
}) {
  const matches = useMediaQuery("(max-width:400px)");
  const [allExercises, setAllExercises] = useState([]);
  const [lastTimeSet, setLastTimeSet] = useState([]);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const emptyValues = {
    id: cuid(),
    name: "",
    sets: [
      {
        id: cuid(),
        reps: "",
        weight: "",
        createdAt: new Date().toISOString(),
        exerciseId: exercise.id || "",
      },
    ],
  };
  useSWR(
    `/api/sessions/exercises`,
    async (...args) => {
      const resp = await fetch(...args, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.id,
          name: session.name,
        }),
      });
      const data = await resp.json();
      setAllExercises(data.exercises);
    },
    {
      revalidateOnFocus: false,
    }
  );

  // event must be changed
  // router should be changed to useEffect
  const handleClick = (set, remove, index) => {
    let timer;
    clearTimeout(timer);
    if (event.detail === 1) {
      timer = setTimeout(() => {
        if (set.toBeDeleted) {
          set.toBeDeleted = false;
          router.push(router.asPath, router.asPath, {
            shallow: true,
          });
        } else if (set.reps && set.weight) {
          set.toBeDeleted = true;
          router.push(router.asPath, router.asPath, {
            shallow: true,
          });
        } else {
          remove(index);
        }
      }, 200);
    } else if (event.detail === 2) {
      set.hideSet = true;
      router.push(router.asPath, router.asPath, {
        shallow: true,
      });
    }
  };
  const getLastTimeSet = async (name, exercise) => {
    const response = await fetch("/api/sessions/exercises/last", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search: name,
        sessionId: session.id,
      }),
    });
    const status = response.status;
    if (status === 200) {
      const data = await response.json();
      if (data.exercises[0]?.id !== exercise.id) {
        setLastTimeSet(data.exercises[0]?.sets);
      } else if (data.exercises.length > 1) {
        setLastTimeSet(data.exercises[1]?.sets);
      }
    }
    return;
  };

  return (
    <Container component="main" sx={{ mt: 3 }}>
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Formik
          enableReinitialize
          initialValues={{
            id: exercise.id || cuid(),
            name: exercise.name || "",
            sets: exercise.sets || [
              {
                id: cuid(),
                reps: "",
                weight: "",
                createdAt: new Date().toISOString(),
              },
            ],
            sessionId: session.id,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const newExercise = {
              id: values.id,
              name: values.name.trim(),
              sets: values.sets,
              sessionId: values.sessionId,
            };
            const resp = await fetch("/api/sessions/exercises/new", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newExercise),
            });
            const json = await resp.json();
            console.log(json);
            if (resp.status === 200) {
              enqueueSnackbar(
                `${json.exercise.name} ${
                  json.created ? "wurde hinzugefügt" : "wurde bearbeitet"
                }`,
                {
                  variant: "success",
                }
              );
              setFetchAgain(true);
              setInitialValues(json.exercise);
            } else
              enqueueSnackbar("an Error has ouccured", { variant: "error" });
          }}
        >
          {({ values, errors, isSubmitting, handleSubmit, handleReset }) => (
            <Box
              as="form"
              onSubmit={handleSubmit}
              onReset={handleReset}
              sx={{ mt: 1, width: "100%", flexGrow: 1 }}
            >
              <Grid container columnSpacing={1}>
                <Grid item xs={12}>
                  <Autocomplete
                    freeSolo
                    disableClearable
                    options={allExercises.map((option) => option.name)}
                    value={exercise.name || ""}
                    onChange={(event, newValue) => {
                      if (newValue !== null) {
                        values.name = newValue;
                        setInitialValues(values);
                        getLastTimeSet(newValue, exercise);
                      }
                    }}
                    renderInput={(params) => (
                      <Field
                        name="name"
                        {...params}
                        margin="normal"
                        required
                        fullWidth
                        type="text"
                        as={TextField}
                        label="Exercise Name"
                        InputProps={{
                          ...params.InputProps,
                          type: "search",
                          startAdornment: (
                            <InputAdornment position="start">
                              <AbcIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <FieldArray name="sets">
                  {({ insert, remove }) => (
                    <Grid
                      container
                      item
                      alignItems="center"
                      justifyContent="center"
                      columnSpacing={1}
                    >
                      {values.sets.map((set, index) => (
                        <Grid
                          container
                          item
                          columnSpacing={1}
                          sx={{
                            display: set.hideSet ? "none" : "flex",
                            alignItems: "center",
                          }}
                          key={index}
                        >
                          <Grid item xs={4.5}>
                            <Field
                              margin="normal"
                              required
                              fullWidth
                              name={`sets[${index}].weight`}
                              label={`Weight - ${index + 1}`}
                              type="number"
                              as={TextField}
                              sx={{
                                textDecoration: set.toBeDeleted
                                  ? "line-through"
                                  : "none",
                              }}
                              disabled={set.toBeDeleted}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FitnessCenterIcon />
                                  </InputAdornment>
                                ),
                                endAdornment: !matches && (
                                  <InputAdornment position="end">
                                    kg
                                  </InputAdornment>
                                ),
                              }}
                              placeholder={`${
                                lastTimeSet[index]?.weight || ""
                              }`}
                            />
                          </Grid>
                          <Grid item xs={4.5}>
                            <Field
                              margin="normal"
                              required
                              fullWidth
                              name={`sets[${index}].reps`}
                              label={`Reps - ${index + 1}`}
                              type="number"
                              as={TextField}
                              sx={{
                                textDecoration: set.toBeDeleted
                                  ? "line-through"
                                  : "none",
                              }}
                              disabled={set.toBeDeleted}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <NumbersIcon />
                                  </InputAdornment>
                                ),
                              }}
                              placeholder={`${lastTimeSet[index]?.reps || ""}`}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={1.5}
                            sx={{
                              padding: "0px!important",
                            }}
                          >
                            <CustomizedTooltips
                              title="Delete"
                              text={`With one click you can highlight the set for deletion Double click to hide the set`}
                            >
                              <IconButton
                                aria-label="Delete"
                                onClick={() => {
                                  handleClick(set, remove, index);
                                }}
                              >
                                {!set.toBeDeleted ? (
                                  <DeleteOutlineIcon />
                                ) : (
                                  <Delete />
                                )}
                              </IconButton>
                            </CustomizedTooltips>
                          </Grid>
                          <Grid
                            item
                            xs={1.5}
                            sx={{
                              padding: "0px!important",
                            }}
                          >
                            <IconButton
                              aria-label="Add"
                              onClick={() => {
                                insert(index + 1, emptyValues.sets[0]);
                                getLastTimeSet(values.name, exercise);
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Grid>
                          {/* <Grid item xs={12}>
                            <Field
                              margin="normal"
                              fullWidth
                              name={`sets[${index}].createdAt`}
                              label={`Created at - ${index + 1}`}
                              type="text"
                              as={TextField}
                            />
                          </Grid> */}
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </FieldArray>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    type="button"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setForm(false);
                      setInitialValues(emptyValues);
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default function EditWorkoutCard({
  session,
  defaultExpand,
  overview = false,
}) {
  const [expanded, setExpanded] = useState(defaultExpand);
  const [openDeleteExercise, setOpenDeleteExercise] = useState(false);
  const [openDeleteSession, setOpenDeleteSession] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState("");
  const [form, setForm] = useState(() => session.exercises.length === 0);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [stateSession, setStateSession] = useState(session);
  const [intialValues, setInitialValues] = useState({});

  function setFetchAgainHandler() {
    setFetchAgain(true);
  }

  useSWR(
    fetchAgain ? `/api/sessions/${stateSession.id}` : null,
    async (...args) => {
      const resp = await fetch(...args, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resp.json();
      setStateSession(data);
      setFetchAgain(false);
    }
  );

  const handleDeleteDialog = (id, index) => {
    if (id === stateSession.id) {
      setOpenDeleteSession(true);
    } else if (id == stateSession.exercises[index].id) {
      console.log(id, index);
      setToBeDeleted(id);
      setOpenDeleteExercise(true);
    }
  };
  const handleDeleteDialogClose = () => {
    setOpenDeleteSession(false);
    setOpenDeleteExercise(false);
  };
  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: theme.palette.card.main,
        borderRadius: 5,
      }}
    >
      {overview ? (
        <NextLink
          href={`/sessions/${stateSession.id}`}
          as={`/sessions/${stateSession.id}`}
          passHref
        >
          <Link sx={{ textDecoration: "none" }}>
            <CardHeader
              title={stateSession.name}
              subheader={
                <time dateTime={stateSession.date}>
                  {format(parseISO(stateSession.date), "LLLL d, yyyy - kk:mm", {
                    timeZone: "Europe/Berlin",
                  })}
                </time>
              }
            />
          </Link>
        </NextLink>
      ) : (
        <CardHeader
          title={stateSession.name}
          subheader={
            <time dateTime={stateSession.date}>
              {format(parseISO(stateSession.date), "LLLL d, yyyy - kk:mm", {
                timeZone: "Europe/Berlin",
              })}
            </time>
          }
        />
      )}
      <CardActions disableSpacing>
        <IconButton aria-label="Edit">
          <NextLink
            href={`/sessions/edit?id=${stateSession.id}`}
            as={`/sessions/edit?id=${stateSession.id}`}
            passHref
          >
            <Edit />
          </NextLink>
        </IconButton>
        <IconButton
          aria-label="Delete"
          onClick={() => {
            handleDeleteDialog(stateSession.id);
          }}
        >
          <Delete sx={{ color: "red" }} />
        </IconButton>
        <DeleteDialog
          open={openDeleteSession}
          onClose={handleDeleteDialogClose}
          url={`/api/sessions/delete`}
          id={stateSession.id}
        />
        <AddMore
          variant="outlined"
          aria-label="Add"
          onClick={() => {
            setForm(true);
            setInitialValues({});
          }}
        >
          Add Exercise
        </AddMore>
        <ExpandMore
          expand={expanded}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <DeleteDialog
            open={openDeleteExercise}
            onClose={handleDeleteDialogClose}
            id={toBeDeleted}
            url={`/api/sessions/exercises/delete`}
            setFetchAgainHandler={setFetchAgainHandler}
          />
          {stateSession.exercises.map((exercise, index) => (
            <div key={exercise.id} id={exercise.id}>
              {index !== 0 && <Hr />}
              <DivForTable>
                <span>{exercise.name}</span>

                <span>
                  <b>Total:</b>{" "}
                  {
                    getWeight(stateSession).map(
                      (exercise) => exercise.weights_sum
                    )[index]
                  }{" "}
                  kg
                  <IconButton
                    aria-label="Delete"
                    onClick={() => handleDeleteDialog(exercise.id, index)}
                    sx={{
                      color: "red",
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Edit"
                    onClick={() => {
                      setInitialValues(exercise);
                      setForm(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </span>
                <table style={{ textAlign: "center", width: "100%" }}>
                  <thead>
                    <tr>
                      {exercise.sets.map((set, index) => (
                        <th key={set.id}>{set.reps}</th>
                      ))}
                      <th>x{exercise.sets.length}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {exercise.sets.map((set, index) => (
                        <td key={set.id}>{set.weight}</td>
                      ))}
                      <td>kg</td>
                    </tr>
                  </tbody>
                </table>
              </DivForTable>
            </div>
          ))}
          {form && (
            <ExerciseForm
              session={stateSession}
              exercise={intialValues}
              setForm={setForm}
              setFetchAgain={setFetchAgain}
              setInitialValues={setInitialValues}
            />
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}
