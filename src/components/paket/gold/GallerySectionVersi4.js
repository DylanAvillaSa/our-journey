"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Gallery4({ background, theme, datamempelai }) {
  const sliderPhotos = datamempelai?.gallery || [
    "/images/prewed-1.jpg",
    "/images/prewed-2.jpg",
    "/images/tmp.jpg",
    "/images/bg-wedding.jpg",
  ];

  const galleryPhotos = datamempelai?.gallery || [
    "/images/prewed-1.jpg",
    "/images/prewed-2.jpg",
    "/images/tmp.jpg",
    "/images/bg-wedding.jpg",
    "/images/bg.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(false);

  // Auto ganti slide setiap 4 detik
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderPhotos.length);
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
    <section className="py-20 px-6 bg-white relative">
      {/* Title */}
      <div className="text-center mb-14">
        <p
          className={`${background[theme].textMain} font-[GreatVibes] text-xl`}
        >
          Moment
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-wide">
          GALLERY
        </h2>
      </div>

      {/* Slider Highlight */}
      <div className="relative mb-16 overflow-hidden rounded-3xl shadow-lg max-w-4xl mx-auto h-96">
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
              src={sliderPhotos[current]}
              alt={`Slider ${current + 1}`}
              fill
              className="object-cover rounded-3xl"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Masonry Style Gallery */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {galleryPhotos.map((src, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl shadow-md group break-inside-avoid"
          >
            <Image
              src={src}
              alt={`Gallery ${idx + 1}`}
              width={600}
              height={800}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay Caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end justify-center p-4">
              <p className="text-white text-sm font-medium">{`Foto ${
                idx + 1
              }`}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
