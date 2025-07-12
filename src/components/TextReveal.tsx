"use client";
import { useEffect } from "react";
import { useAnimationControls, motion, easeInOut } from "framer-motion";

interface Props {
  text: string;
}

const TextReveal = ({ text }: Props) => {
  const controls = useAnimationControls();

  const textReveal = {
    hidden: {
      clipPath: "inset(0 0 0 100%)", // Start fully hidden from right to left
      opacity: 0,
    },
    visible: {
      clipPath: "inset(0 0 0 0%)", // Reveal fully
      opacity: 1,
      transition: {
        duration: 2,
        ease: easeInOut,
      },
    },
  };

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <motion.div
      className="inline-block text-center dark:text-[#d2e5f5] p-4"
      initial="hidden"
      animate={controls}
      variants={textReveal}
      dir="rtl"
    >
      {text}
    </motion.div>
  );
};

export default TextReveal;
