import { DefaultSeoProps } from "next-seo";

const title = "WebRTC and Web Sockets";
const url = "";
const description = "";
const image = "";

const config: DefaultSeoProps = {
  title,
  description,
  openGraph: {
    type: "website",
    url,
    site_name: title,
    images: [
      {
        url: image,
        width: 512,
        height: 512,
      },
    ],
  },
  twitter: {
    handle: "",
    cardType: "summary",
  },
};

export default config;
