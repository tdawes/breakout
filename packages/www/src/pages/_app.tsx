import { AppProps } from "next/app";
import { Styled, ThemeProvider } from "theme-ui";
import theme from "../styles";
import * as firebase from "firebase/app";

import { UserProvider } from "../providers/user";
import { RoomProvider } from "../providers/room";
import { TableProvider } from "../providers/table";

if (process.env.CONFIG) {
  const config = JSON.parse(process.env.CONFIG);
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebase);
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <RoomProvider>
          <TableProvider>
            <Styled.root>
              <Component {...pageProps} />
            </Styled.root>
          </TableProvider>
        </RoomProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default MyApp;
