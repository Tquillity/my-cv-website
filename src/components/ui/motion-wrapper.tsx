"use client";

import { motion, HTMLMotionProps } from "framer-motion";

type MotionDivProps = HTMLMotionProps<"div">;
type MotionH1Props = HTMLMotionProps<"h1">;
type MotionPProps = HTMLMotionProps<"p">;

export const MotionDiv: React.FC<MotionDivProps> = (props) => (
  <motion.div {...props} />
);

export const MotionH1: React.FC<MotionH1Props> = (props) => (
  <motion.h1 {...props} />
);

export const MotionP: React.FC<MotionPProps> = (props) => (
  <motion.p {...props} />
);

