"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Gallery3({ background, theme, datamempelai }) {
  const photos = datamempelai?.gallery || [
    "/foto-dummy/slider1.avif",
    "/foto-dummy/slider2.jpeg",
    "/foto-dummy/slider3.avif",
    "/foto-dummy/slider4.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(false);

  // Auto ganti slide setiap 4 detik
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

  // Auto zoom in/out setiap 2 detik
  useEffect(() => {
    const zoomInterval = setInterval(() => {
      setZoom((prev) => !prev);
    }, 2000);
    return () => clearInterval(zoomInterval);
  }, []);

  return (
    <section className="py-16 px-6 bg-white relative">
      {/* Title */}
      <div className="text-center mb-10">
        <p
          className={`${background[theme].textMain} font-[GreatVibes] text-xl`}
        >
          Moment
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-wide">
          GALLERY
        </h2>
      </div>

      {/* Slider otomatis + zoom */}
      <div className="relative w-full md:w-3/4 mx-auto overflow-hidden rounded-xl shadow-lg h-96">
        <AnimatePresence>
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: zoom ? 1.05 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={photos[current]}
              alt={`Slider ${current + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gallery Grid di bawah slider */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((src, idx) => (
          <div
            key={idx}
            className="relative w-full h-48 md:h-56 rounded-lg overflow-hidden shadow-md"
          >
            <Image
              src={src}
              alt={`Gallery ${idx + 1}`}
              fill
              className="object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
