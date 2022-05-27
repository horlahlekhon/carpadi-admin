import "../styles/globals.css";
import { theme, GlobalStyles } from "../styles/theme.config";
import { ThemeProvider } from "@mui/material/styles";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
