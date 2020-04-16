/** @jsx jsx */
import * as React from "react";
import { Text, Flex, Box, jsx } from "theme-ui";
import { User } from "../types";
import { useVideo } from "../providers/room";
import { VideoOff } from "react-feather";

const UserVideo: React.FC<{ image: string; user: User }> = (props) => {
  const stream = useVideo(props.user.id);

  return (
    <Flex
      {...props}
      sx={{
        position: "relative",
        alignItems: "flex-end",
        width: "100%",
        height: "100%",
      }}
    >
      {stream != null && (
        <Video mediaStream={stream} autoPlay playsInline muted controls />
      )}

      {stream == null && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <VideoOff size={28} />
          <Text sx={{ fontSize: 3, pt: 2 }}>No Stream</Text>
        </Box>
      )}

      <Box
        sx={{
          width: "100%",
          px: 2,
          py: 1,
          bg: "#6665658f",
          fontSize: 1,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {props.children}
      </Box>
    </Flex>
  );
};

const Video: React.FC<
  { mediaStream: MediaStream } & React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >
> = ({ mediaStream, ...rest }) => {
  const ref = React.createRef<HTMLVideoElement>();

  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return (
    <video
      ref={ref}
      {...rest}
      sx={{
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    />
  );
};

export default UserVideo;
