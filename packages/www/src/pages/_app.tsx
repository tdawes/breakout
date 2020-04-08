import { AppProps } from "next/app";
import { Styled, ThemeProvider } from "theme-ui";
import theme from "../styles";
import * as firebase from "firebase/app";

const config = JSON.parse(process.env.CONFIG);
if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase);
}

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
