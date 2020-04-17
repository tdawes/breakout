/** @jsx jsx */
import * as React from "react";
import { Text, Flex, Box, jsx } from "theme-ui";
import { User } from "../types";
import { useVideo, useRoom } from "../providers/room";
import { VideoOff } from "react-feather";

const BoxMessage: React.FC = (props) => (
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
    {props.children}
  </Box>
);

const UserVideo: React.FC<{
  image: string;
  user: User;
  showIfOnStage?: boolean;
}> = (props) => {
  const stream = useVideo(props.user.id);
  const {
    currentUser: { data: user },
  } = useRoom();

  const shouldMute =
    process.env.NODE_ENV === "development" ||
    (user != null && user.id === props.user.id);

  return (
    <Flex
      {...props}
      sx={{
        flexDirection: "column",
        alignItems: "flex-end",
        width: "100%",
      }}
    >
      {props.user.onStage && !props.showIfOnStage ? (
        <BoxMessage>
          <Text>User is on stage</Text>
        </BoxMessage>
      ) : (
        <>
          {stream != null && (
            <Video
              mediaStream={stream}
              autoPlay
              playsInline
              muted={shouldMute}
              controls
            />
          )}

          {stream == null && (
            <BoxMessage>
              <VideoOff size={28} />
              <Text sx={{ fontSize: 3, pt: 2 }}>No Stream</Text>
            </BoxMessage>
          )}
        </>
      )}

      <Box
        sx={{
          width: "100%",
          px: 2,
          py: 1,
          bg: "#6665658f",
          fontSize: 1,
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
