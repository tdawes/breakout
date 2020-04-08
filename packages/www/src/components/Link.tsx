import NLink from "next/link";
import * as React from "react";
import { Link as TLink } from "theme-ui";
import { SystemStyleObject } from "@styled-system/css";

export interface Props {
  href: string;
  target?: string;
  variant?: string;
  className?: string;
  sx?: SystemStyleObject;
  as?: string;
}

const isExternalLink = (href: string): boolean =>
  href.startsWith("http://") || href.startsWith("https://");

const Link: React.FC<Props> = (props) => {
  const href = props.href;

  const as = props.as;

  const tProps = {
    ...props,
    as: undefined,
  } as Omit<Props, "as">;

  if (isExternalLink(href)) {
    return (
      <TLink href={href} target="_blank" rel="noopener" {...tProps}>
        {props.children}
      </TLink>
    );
  }

  return (
    <NLink href={href} as={as}>
      <TLink {...tProps}>{props.children}</TLink>
    </NLink>
  );
};

export default Link;
