"use client";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { fonts } from "@/app/layout";

export default function GaleriFoto() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: false, amount: 0.3 }}
      className="flex-shrink-0 w-screen snap-center bg-[#fdfaf5] flex flex-col items-center justify-start px-6 py-16 overflow-hidden"
    >
      {/* Judul */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className={`text-5xl md:text-5xl font-[GreatVibes] text-[#7a5c3a] mb-10 ${fonts.greatVibes.className}`}
      >
        Galeri Foto
      </motion.h2>

      {/* Slider */}
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="w-full max-w-3xl"
      >
        {/* Foto 1 */}
        <SwiperSlide>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/aset-foto/slide1.webp"
              alt="Galeri Foto 1"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </SwiperSlide>

        {/* Foto 2 */}
        <SwiperSlide>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/aset-foto/slide2.webp"
              alt="Galeri Foto 1"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </SwiperSlide>

        {/* Foto 3 */}
        <SwiperSlide>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/aset-foto/slide3.webp"
              alt="Galeri Foto 1"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </SwiperSlide>

        {/* Foto 4 */}
        <SwiperSlide>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/aset-foto/slide4.webp"
              alt="Galeri Foto 1"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </motion.section>
  );
}
