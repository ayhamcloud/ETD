import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#3e3e3e",
    },
    secondary: {
      main: "#5a3e2f",
    },
    error: {
      main: red.A400,
    },
    text: {
      primary: "#3e3e3e",
      secondary: "#1a1a1a",
      onImage: "#f0f0f0",
    },
    card: {
      main: "#fbfbfb",
    },
  },
  hr: {
    border: "0",
    height: "1px",
    background: "#333",
    backgroundImage: "linear-gradient(to right, #ccc, #333, #ccc)",
    width: "100%",
  },
});

export default theme;
