"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "Smart Matching",
    description: "Our algorithm connects you with people who truly fit your vibe.",
  },
  {
    title: "Safe & Secure",
    description: "We prioritize your safety with profile verification and harassment detection.",
  },
  {
    title: "Real-time Chat",
    description: "Engage in seamless conversations with your matches instantly.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export function AnimatedFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-8 md:grid-cols-3"
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          custom={index}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={cardVariants}
          className="rounded-lg border bg-card p-6 shadow-sm text-center"
        >
          <h3 className="mb-2 font-headline text-xl font-semibold">{feature.title}</h3>
          <p className="text-muted-foreground">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
