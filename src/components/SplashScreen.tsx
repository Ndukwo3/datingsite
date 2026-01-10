"use client";

import { motion } from "framer-motion";
import { Logo } from "./Logo";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut" 
        }}
      >
        <Logo iconOnly className="!gap-0" />
      </motion.div>
    </div>
  );
}
