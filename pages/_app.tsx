import "@/styles/global.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { StoreProvider } from "../utils/Store";
import theme from "../src/theme";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <StoreProvider>
        <SnackbarProvider maxSnack={3}>
          <Component {...pageProps} />
        </SnackbarProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
