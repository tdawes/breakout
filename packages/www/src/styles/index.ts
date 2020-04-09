import { system } from "@theme-ui/presets";
import { Theme } from "theme-ui";
import { SystemStyleObject } from "@styled-system/css";

// system font
const font = [
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Oxygen-Sans",
  "Ubuntu",
  "Cantarell",
  "Helvetica Neue",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
].join(",");

const heading = {
  fontFamily: "heading",
  lineHeight: "heading",
  fontWeight: "heading",
};

const baseLink: SystemStyleObject = {
  color: "text",
  textDecoration: "underline",
  transition: "all 150ms ease-in-out",
  cursor: "pointer",

  "&:hover,&:focus,&:active": {
    color: "text",
    bg: "accent",
  },
};

const baseInput: SystemStyleObject = {
  pl: 0,
  borderRadius: 0,
  borderWidth: 2,
  border: "none",
  borderBottom: "solid 2px",
  borderColor: "grey.200",
  transition: "border 150ms ease-in-out",

  "&:focus": {
    borderColor: "text",
    outline: "none",
  },

  "&.error": {
    borderColor: "error",
  },
};

const baseButton: SystemStyleObject = {
  color: "text",
  backgroundImage: ({ colors }) =>
    `linear-gradient(to bottom, ${colors.green[200]}, ${colors.green[600]})`,
  cursor: "pointer",
  py: 1,
  borderRadius: 2,
  transition: "all 150ms ease-in-out",

  "&:hover,&:focus,&:active": {
    backgroundImage: ({ colors }) =>
      `linear-gradient(to bottom, ${colors.green[600]}, ${colors.green[200]})`,
  },
};

const baseColors = {
  purple: {
    100: "#504A5C",
    200: "#3B344B",
    800: "#231E2C",
  },
  green: {
    200: "#A9D35E",
    600: "#5D9338",
  },
  orange: {
    200: "#F0A05D",
    600: "#E67739",
  },
  grey: {
    100: "#DCDDDE",
    200: "#6A6672",
    400: "#cecece",
    500: "#CAC8CD",
    600: "#737373",
    700: "#666565",
  },
};

const theme: Theme = {
  ...system,
  colors: {
    text: "white",
    background: "#26212E",
    primary: baseColors.green[200],
    secondary: "#5990DC",
    accent: "#fbba72",
    muted: "#313030",
    error: "red",
    success: baseColors.green[200],
    ...baseColors,
  },

  breakpoints: ["40em", "52em", "64em"],

  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },

  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],

  fonts: {
    body: font,
    heading: font,
    monospace: "Consolas, Liberation Mono, Menlo, Courier, monospace",
  },

  fontSizes: [12, 14, 16, 18, 24, 32, 48, 64, 96],

  sizes: {
    container: "1000px",
    logList: "400px",
    measure: "32em",
    narrow: "22em",
    header: "6rem",
    stage: "300px",
  },

  lineHeights: {
    body: 1.6,
    heading: 1.125,
  },

  buttons: {
    primary: baseButton,
    secondary: {
      ...baseButton,
      backgroundImage: ({ colors }) =>
        `linear-gradient(to bottom, ${colors.orange[200]}, ${colors.orange[600]})`,

      "&:hover,&:focus,&:active": {
        backgroundImage: ({ colors }) =>
          `linear-gradient(to bottom, ${colors.orange[600]}, ${colors.orange[200]})`,
      },
    },
    subtle: {
      color: "text",
      border: "solid 1px",
      borderColor: "text",
      borderRadius: 0,
      cursor: "pointer",
      bg: "purple.100",
      transition: "all 150ms ease-in-out",

      "&:hover,&:focus,&:active": {
        borderColor: "green.200",
      },
    },
    icon: {
      cursor: "pointer",
      borderRadius: 2,
      transition: "all 150ms ease-in-out",

      "&:hover,&:focus,&:active": {
        bg: "accent",
      },
    },
  },

  links: {
    dark: {
      ...baseLink,
      color: "black",

      "&:hover,&:focus,&:active": {
        color: "currentColor",
        bg: "accent",
      },
    },
    button: {
      ...baseButton,
      px: 3,
      textDecoration: "none",
      display: "inline-block",
    },
    nav: {
      ...baseLink,
      px: 2,
      py: 1,
      fontSize: 2,
      fontWeight: "bold",
      textDecoration: "none",
    },
  },

  forms: {
    input: baseInput,
    logInput: {
      ...baseInput,
    },
    slider: {
      color: "primary",
    },
    textarea: {
      borderRadius: 0,
      borderColor: "grey.600",
      resize: "vertical",
      maxHeight: "200px",
      fontSize: 2,
      fontFamily: "body",

      "&:focus": {
        outline: "none",
        borderColor: "accent",
      },
    },
  },

  text: {
    heading,
    display: {
      variant: "textStyles.heading",
      fontSize: [7, 8],
      fontWeight: "heading",
      letterSpacing: "-0.03em",
      mt: 3,
    },
  },

  styles: {
    ...system.styles,
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",

      /* Better Font Rendering */
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    h1: {
      variant: "textStyles.display",
      fontSize: 6,
    },
    h2: {
      variant: "textStyles.heading",
      fontSize: 5,
    },
    h3: {
      variant: "textStyles.heading",
      fontSize: 4,
      mb: 3,
    },
    h4: {
      variant: "textStyles.heading",
      fontSize: 3,
    },
    h5: {
      variant: "textStyles.heading",
      fontSize: 2,
    },
    h6: {
      variant: "textStyles.heading",
      fontSize: 1,
    },
    a: baseLink,
    p: {
      code: {
        color: "text",
        p: "2px",
        borderRadius: "4px",
      },
    },
    pre: {
      fontFamily: "monospace",
      fontSize: 1,
      p: 3,
      color: "text",
      bg: "muted",
      overflow: "auto",
      code: {
        color: "inherit",
      },
    },
    code: {
      fontFamily: "monospace",
      backgroundColor: "muted",
      p: 2,
      borderRadius: "4px",
      fontSize: 2,
    },
    blockquote: {
      mt: 0,
      mx: 0,
      py: 0,
      pr: 0,
      pl: 3,
      borderLeft: "solid 4px hsla(0,0%,0%,0.13)",
      color: "hsla(0,0%,0%,0.53)",
    },
    ul: {},
    li: {
      pb: 1,
    },
  },
};

export default theme;
