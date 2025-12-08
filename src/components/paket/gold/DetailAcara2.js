"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function DetailAcara2({ T, background, datamempelai }) {
  const events = [
    {
      type: "Akad",
      date: datamempelai?.tanggalAkad || "Sabtu, 25 November 2025",
      time: datamempelai?.jamAkad || "08:00 WIB",
      location: datamempelai?.lokasiAkad || "Masjid Al-Falah, Jakarta Selatan",
      icon: <Calendar size={28} />,
    },
    {
      type: "Resepsi",
      date: datamempelai?.tanggalResepsi || "Sabtu, 27 November 2025",
      time: datamempelai?.jamResepsi || "10:00 WIB",
      location:
        datamempelai?.lokasiResepsi || "Masjid Al-Falah, Jakarta Selatan",
      icon: <Calendar size={28} />,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative py-20 px-6 m-4"
    >
      {/* Frame mewah */}
      <div
        className={`absolute inset-0 rounded-2xl border-4 ${background[T].border} shadow-2xl pointer-events-none`}
      />

      {/* Ornamen kiri */}
      <motion.img
        src="/asset/ornament-atas.png"
        alt="ornamen kiri"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="absolute top-0 left-0 w-32 md:w-48"
      />

      {/* Ornamen kanan */}
      <motion.img
        src="/asset/ornament-atas.png"
        alt="ornamen kanan"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        viewport={{ once: true }}
        className="absolute top-0 right-0 w-32 md:w-48 rotate-180"
      />

      {/* Judul */}
      <h3
        className={`relative text-center font-[--playfair] text-3xl md:text-4xl mb-14 ${background[T].textMain}`}
      >
        Detail Acara
      </h3>

      {/* Isi event */}
      <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row justify-center gap-12 md:gap-20">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.3 }}
            className="relative flex-1 bg-white/70 backdrop-blur-md rounded-xl shadow-xl p-8 border border-gray-200"
          >
            {/* Icon di atas */}
            <div
              className={`mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full ${background[T].chip}`}
            >
              {event.icon}
            </div>

            {/* Nama event */}
            <h4 className="text-2xl md:text-3xl font-[--greatVibes] text-gray-800 mb-2">
              {event.type}
            </h4>

            {/* Tanggal */}
            <p className="text-lg md:text-xl text-gray-700 font-[--playfair]">
              {event.date}
            </p>

            {/* Waktu */}
            <p className="flex items-center justify-center gap-2 text-gray-600 text-lg mt-2">
              <Clock size={18} /> {event.time}
            </p>

            {/* Lokasi */}
            <p className="flex items-center justify-center gap-2 text-gray-600 text-lg mt-1">
              <MapPin size={18} /> {event.location}
            </p>

            {/* Dress Code / Note */}
            {event.dressCode && (
              <p className="mt-3 text-gray-700 text-base italic">
                {event.dressCode}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
