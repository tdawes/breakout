import { AppProps } from "next/app";
import { Styled, ThemeProvider } from "theme-ui";
import { RoomProvider } from "../providers/room";
import theme from "../styles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <RoomProvider>
        <Styled.root>
          <Component {...pageProps} />
        </Styled.root>
      </RoomProvider>
    </ThemeProvider>
  );
}

export default MyApp;
