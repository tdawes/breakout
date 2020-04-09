import { AppProps } from "next/app";
import { Styled, ThemeProvider } from "theme-ui";
import { RoomProvider } from "../providers/room";
import { TableProvider } from "../providers/table";
import { UserProvider } from "../providers/user";
import theme from "../styles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <RoomProvider>
        <TableProvider>
          <UserProvider>
            <Styled.root>
              <Component {...pageProps} />
            </Styled.root>
          </UserProvider>
        </TableProvider>
      </RoomProvider>
    </ThemeProvider>
  );
}

export default MyApp;
