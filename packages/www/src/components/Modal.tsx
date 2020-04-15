/** @jsx jsx */
import * as React from "react";
import { Box, Flex, jsx } from "theme-ui";
import ReactModal from "react-modal";

export interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  disableClose?: boolean;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

ReactModal.setAppElement("#__next");

const Modal: React.FC<Props> = (props) => {
  return (
    <ReactModal
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      style={customStyles}
      shouldCloseOnEsc={props.disableClose}
      shouldCloseOnOverlayClick={props.disableClose}
    >
      <Box
        sx={{
          p: 2,
          color: "textDark",
        }}
      >
        {props.children}
      </Box>
    </ReactModal>
  );
};

export default Modal;
