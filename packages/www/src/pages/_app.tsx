import { AppProps } from "next/app";
import { Styled, ThemeProvider } from "theme-ui";
import theme from "../styles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Styled.root>
        <Component {...pageProps} />
      </Styled.root>
    </ThemeProvider>
  );
}

export default MyApp;
