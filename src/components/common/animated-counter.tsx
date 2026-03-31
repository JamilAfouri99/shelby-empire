"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

type AnimatedCounterProps = {
  value: number;
  className?: string;
};

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.8,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (latest) => {
      if (displayRef.current) {
        displayRef.current.textContent = String(latest);
      }
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, motionValue, rounded]);

  return (
    <motion.span
      ref={displayRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {value}
    </motion.span>
  );
}
