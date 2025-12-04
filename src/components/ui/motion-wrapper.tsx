"use client";

import { motion, HTMLMotionProps } from "framer-motion";

type MotionDivProps = HTMLMotionProps<"div">;
type MotionH1Props = HTMLMotionProps<"h1">;
type MotionPProps = HTMLMotionProps<"p">;

export const MotionDiv: React.FC<MotionDivProps> = (props) => {
  const { children, ...rest } = props;
  // Ensure children is not null or undefined, although React usually handles this.
  // The issue might be related to how motion handles children during hydration or initialization.
  // However, a white screen often implies a JS error or empty content.
  // Let's wrap this.
  return <motion.div {...rest}>{children}</motion.div>;
};

export const MotionH1: React.FC<MotionH1Props> = (props) => {
  const { children, ...rest } = props;
  return <motion.h1 {...rest}>{children}</motion.h1>;
};

export const MotionP: React.FC<MotionPProps> = (props) => {
  const { children, ...rest } = props;
  return <motion.p {...rest}>{children}</motion.p>;
};

