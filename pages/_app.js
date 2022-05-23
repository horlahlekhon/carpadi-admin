import "../styles/globals.css";
import { ThemeProvider } from "styled-components";
import { theme, GlobalStyles } from "../styles/theme.config";

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
