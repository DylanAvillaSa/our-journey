"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function DetailAcara({ T, background, datamempelai }) {
  const events = [
    {
      type: "Akad",
      date: datamempelai?.tanggalAkad || "Tanggal belum ditentukan",
      time: datamempelai?.jamAkad
        ? datamempelai.jamAkad + " WIB"
        : "Waktu belum ditentukan",
      location: datamempelai?.lokasiAkad || "Lokasi belum ditentukan",
      icon: <Calendar size={24} />,
    },
    {
      type: "Resepsi",
      date: datamempelai?.tanggalResepsi || "Tanggal belum ditentukan",
      time: datamempelai?.jamResepsi
        ? datamempelai.jamResepsi + " WIB"
        : "Waktu belum ditentukan",
      location: datamempelai?.lokasiResepsi || "Lokasi belum ditentukan",
      icon: <Calendar size={24} />,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`py-16 px-6 bg-white relative border-4 ${background[T].border} rounded-md m-2`}
    >
      <h3
        className={`text-center font-[--playfair] text-3xl md:text-4xl mb-12 ${background[T].textMain}`}
      >
        Detail Acara
      </h3>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:justify-between gap-16">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.3 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            {event.type == "Resepsi" && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 0.8 }}
                transition={{ duration: 1.5 }}
                className={`border-2 w-full ${background[T].chip} `}
              ></motion.div>
            )}

            <div className={`text-[${T.textMain} mt-4] mb-2`}>{event.icon}</div>

            <h4 className="text-2xl md:text-3xl font-[--greatVibes] text-center">
              {event.type}
            </h4>

            <p className="text-lg md:text-xl text-gray-700 font-[--playfair]">
              {event.date}
            </p>

            <p className="flex items-center justify-center gap-2 text-gray-600 text-lg">
              <Clock size={18} /> {event.time}
            </p>

            <p className="flex items-center justify-center gap-2 text-gray-600 text-lg">
              <MapPin size={18} /> {event.location}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
