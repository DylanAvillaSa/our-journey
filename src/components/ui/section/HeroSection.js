"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="from-[#FFEFBA] via-[#FFFFFF] to-[#FFFFFF] px-6 md:px-24 py-24 flex flex-col md:flex-row items-center gap-12">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-[#111]">
          Undangan Digital Our Journey
        </h1>
        <p className="text-gray-600 mb-6">
          Rayakan momen spesialmu dengan undangan digital yang elegan dan mudah
          dibagikan.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => window.scrollTo({ top: 1000, behavior: "smooth" })}
          className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-xl font-semibold shadow-lg transition"
        >
          Lihat Template
        </motion.button>
      </motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/images/latar-belakang.jpg"
          alt="Undangan Digital"
          width={500}
          height={500}
          className="rounded-2xl shadow-2xl"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
