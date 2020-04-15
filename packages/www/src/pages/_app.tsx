import { AppProps } from "next/app";
import { Styled, ThemeProvider } from "theme-ui";
import { RoomProvider } from "../providers/room";
import { VideoProvider } from "../providers/video";
import theme from "../styles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <RoomProvider>
        {/* <VideoProvider> */}
        <Styled.root>
          <Component {...pageProps} />
        </Styled.root>
        {/* </VideoProvider> */}
      </RoomProvider>
    </ThemeProvider>
  );
}

export default MyApp;
