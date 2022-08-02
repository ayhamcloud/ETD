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
      secondary: "#1a1a1a"
    }
  }
});

export default theme;
