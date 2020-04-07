import { AppProps } from "next/app";
import { Styled, ThemeProvider } from "theme-ui";
import theme from "../styles";
import { UserProvider } from "../providers/user";
import { RoomProvider } from "../providers/room";
import { TableProvider } from "../providers/table";

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
