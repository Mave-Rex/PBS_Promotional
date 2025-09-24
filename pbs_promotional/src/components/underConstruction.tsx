"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";

export default function UnderConstruction() {
  const controls = useAnimationControls();
  const shadow = useAnimationControls();
  const [biting, setBiting] = useState(false);

  // Animación idle en loop
  const startIdle = () => {
    controls.start({
      y: [0, -6, 0],
      rotate: [0, -2, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    });
    shadow.start({
      scaleX: [1, 1.05, 1],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    });
  };

  useEffect(() => {
    startIdle();
  }, []);

  const handleBite = async () => {
    if (biting) return;
    setBiting(true);

    // Detenemos idle (opcional: controls.stop())
    controls.stop();
    shadow.stop();

    // Secuencia “mordida”
    await controls.start({
      x: -6,
      rotate: -8,
      scaleX: 0.98,
      scaleY: 1.02,
      transition: { duration: 0.08 },
    });
    await controls.start({
      x: 14,
      rotate: 10,
      scaleX: 1.08,
      scaleY: 0.9,
      transition: { duration: 0.09 },
    });
    await controls.start({
      x: 0,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
      transition: { type: "spring", stiffness: 600, damping: 18 },
    });

    // Sombra reacciona
    await shadow.start({
      scaleX: [1, 1.15, 0.95, 1],
      transition: { duration: 0.3 },
    });

    setBiting(false);
    startIdle(); // volvemos al idle loop
  };

  return (
    <div className="w-full flex items-center justify-center py-16">
      <motion.button
        onClick={handleBite}
        aria-label="T-Rex under construction"
        className="relative cursor-pointer select-none outline-none"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          filter:
            "drop-shadow(0 0 10px rgba(0,255,255,0.55)) drop-shadow(0 0 24px rgba(0,255,255,0.35))",
        }}
      >
        {/* Siempre usamos controls en animate */}
        <motion.div animate={controls} initial={false}>
          <Image
            src="/images/under_construction.png"
            alt="Under construction T-Rex"
            width={408}
            height={612}
            priority
            className="pointer-events-none"
          />
        </motion.div>

        {/* Sombra */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-3 w-40 rounded-full bg-black/20 blur-md"
          animate={shadow}
          initial={false}
        />
      </motion.button>
    </div>
  );
}
