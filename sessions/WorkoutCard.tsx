import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { Delete, Edit } from "@mui/icons-material";
import { getWeight } from "../../utils/session";
import { Link } from "@mui/material";
import theme from "../../src/theme";
import NextLink from "next/link";
import { format, parseISO } from "date-fns";
import DeleteDialog from "../dialogs/DeleteDialog";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import InfoIcon from "@mui/icons-material/Info";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
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
});

function WorkoutCard({ session, defaultExpand, modifiable, overview = false }) {
  const [expanded, setExpanded] = useState(defaultExpand);
  const [openDelelte, setOpenDelete] = useState(false);

  const handleDeleteDialog = () => {
    setOpenDelete(true);
  };
  const handleDeleteDialogClose = () => {
    setOpenDelete(false);
  };

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: theme.palette.card.main,
        borderRadius: 5,
      }}
    >
      {!overview ? (
        <NextLink
          href={`/sessions/${session.id}`}
          as={`/sessions/${session.id}`}
          passHref
        >
          <Link sx={{ textDecoration: "none" }}>
            <CardHeader
              title={
                overview ? (
                  session.name
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <InfoIcon sx={{ marginRight: "5px" }} /> {session.name}
                  </div>
                )
              }
              subheader={
                <>
                  <time dateTime={session.date}>
                    {format(parseISO(session.date), "LLLL d, yyyy - kk:mm", {
                      timeZone: "Europe/Berlin",
                    })}
                  </time>
                  {session.exercises.length > 0 && (
                    <>
                      <br />
                      <b>Last update:</b>{" "}
                      <time
                        dateTime={
                          session.exercises[session.exercises.length - 1]
                            .updatedAt
                        }
                      >
                        {format(
                          parseISO(
                            session.exercises[session.exercises.length - 1]
                              .updatedAt
                          ),
                          "LLLL d, yyyy - kk:mm",
                          {
                            timeZone: "Europe/Berlin",
                          }
                        )}
                      </time>
                    </>
                  )}
                </>
              }
            />
          </Link>
        </NextLink>
      ) : (
        <CardHeader
          title={
            overview ? (
              session.name
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <InfoIcon sx={{ marginRight: "5px" }} /> {session.name}
              </div>
            )
          }
          subheader={
            <>
              <time dateTime={session.date}>
                {format(parseISO(session.date), "LLLL d, yyyy - kk:mm", {
                  timeZone: "Europe/Berlin",
                })}
              </time>
              {session.exercises.length > 0 && (
                <>
                  <br />
                  <b>Last update:</b>{" "}
                  <time
                    dateTime={
                      session.exercises[session.exercises.length - 1].updatedAt
                    }
                  >
                    {format(
                      parseISO(
                        session.exercises[session.exercises.length - 1]
                          .updatedAt
                      ),
                      "LLLL d, yyyy - kk:mm",
                      {
                        timeZone: "Europe/Berlin",
                      }
                    )}
                  </time>
                </>
              )}
            </>
          }
        />
      )}
      <CardActions disableSpacing>
        {modifiable ? (
          <>
            <IconButton aria-label="Edit">
              <NextLink
                href={`/sessions/exercises?id=${session.id}`}
                as={`/sessions/exercises?id=${session.id}`}
                passHref
              >
                <Edit />
              </NextLink>
            </IconButton>
            <IconButton aria-label="Delete" onClick={handleDeleteDialog}>
              <Delete />
            </IconButton>
            <DeleteDialog
              open={openDelelte}
              onClose={handleDeleteDialogClose}
              id={session.id}
              url="/api/sessions/delete"
            />
          </>
        ) : null}
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
          {session.exercises.map((exercise, index) => (
            <div key={index}>
              {index !== 0 && <Hr />}
              <DivForTable>
                <span>
                  {exercise.name}
                  <IconButton aria-label="Statistics">
                    <NextLink
                      href={`/stats/exercise/${exercise.name}`}
                      as={`/stats/exercise/${exercise.name}`}
                      passHref
                    >
                      <QueryStatsIcon />
                    </NextLink>
                  </IconButton>
                </span>
                <span>
                  <b>Total:</b>{" "}
                  {
                    getWeight(session).map((exercise) => exercise.weights_sum)[
                      index
                    ]
                  }{" "}
                  kg
                </span>
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
              </DivForTable>
            </div>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default WorkoutCard;
