"use client";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function Parralax({ images, currentImage, datamempelai }) {
  const containerRef = useRef(null);

  // Scroll progress
  const { scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Background geser jauh (biar kerasa parallax banget)
  const yParallaxBg = useTransform(scrollY, [0, 500], [0, 300]);

  // Konten geser halus (kebalikan biar ada depth)
  const yParallaxText = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100vh] overflow-hidden"
    >
      {/* Background dengan parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ y: yParallaxBg }} // Parallax background
          className="absolute inset-0"
        >
          <Image
            src={images[currentImage]}
            alt="Pasangan"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Konten Utama */}
      <motion.div
        style={{ y: yParallaxText }} // Parallax teks
        className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10 text-white"
      >
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="uppercase tracking-widest text-sm md:text-base text-gray-200 mb-3"
        >
          The Wedding Of
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="font-[GreatVibes] text-5xl md:text-7xl drop-shadow-lg"
        >
          {datamempelai?.panggilanPria || "Putra"} &{" "}
          {datamempelai?.panggilanWanita || "Putri"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-6 text-lg md:text-lg tracking-wide"
        >
          {datamempelai?.tanggalAkad || "Senin, 12 Mei 2025"}
        </motion.p>
      </motion.div>
    </div>
  );
}
