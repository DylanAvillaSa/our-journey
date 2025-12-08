"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export const stories = [
  {
    title: "Kenalan",
    when: "2018",
    text: "Ketemu di kafe dekat kampus. Dari obrolan ringan sampai akhirnya sering ketemu.",
  },
  {
    title: "Jadian",
    when: "2019",
    text: "Mulai pacaran setelah beberapa bulan PDKT yang penuh deg-degan.",
  },
  {
    title: "Lamaran",
    when: "2024",
    text: "Lamaran sederhana di rumah keluarga dengan penuh kebahagiaan.",
  },
  {
    title: "Menikah",
    when: "2025",
    text: "Akhirnya resmi mengikat janji suci dan memulai perjalanan hidup bersama ❤️",
    highlight: true,
  },
];

export default function LoveStory({ T, background, datamempelai }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className={`py-14 px-6 bg-gradient-to-b ${background[T.card]}`}
    >
      {/* Ornament Kiri */}
      <motion.div
        initial={{ opacity: 0, translateX: -100 }}
        whileInView={{ opacity: 1, translateX: 1 }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, -2, 2, 0],
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
        className="absolute top-5 left-0 w-32 md:w-48 opacity-90"
      >
        <img src="/asset/ornament.png" alt="ornament kiri" className="w-full" />
      </motion.div>

      {/* Ornament Kanan */}
      <motion.div
        initial={{ opacity: 0, translateX: 100 }}
        whileInView={{ opacity: 1, translateX: 1 }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, -2, 2, 0],
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
        className="absolute top-5 right-0 w-32 md:w-48 opacity-90"
      >
        <img src="/asset/ornament.png" alt="ornament kiri" className="w-full" />
      </motion.div>

      <h3
        className={`text-center font-bold text-2xl md:text-3xl mb-10 ${background[T].textMain}`}
      >
        Our Love Story
      </h3>

      <div className="relative max-w-3xl mx-auto">
        {/* Garis timeline */}
        <div
          className={`absolute top-0 left-1/2 w-1 h-full ${background[T].cta} -translate-x-1/2`}
        ></div>

        <div className="space-y-12">
          {datamempelai?.loveStory.length > 0
            ? datamempelai?.loveStory.map((it, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  className={`relative w-full md:w-1/2 ${
                    idx % 2 === 0
                      ? "md:pr-10 md:text-right"
                      : "md:pl-10 md:ml-auto"
                  }`}
                >
                  {/* Titik di timeline */}
                  <div
                    className={`absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${background[T].cta} shadow-lg border-4 border-white z-10`}
                  ></div>
                  {/* Card */}
                  <div
                    className={`p-5 rounded-2xl shadow-lg border ${background[T].border} ${background[T].card} bg-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg">{it.title}</h4>
                        <p className="text-xs text-gray-500">{it.when}</p>
                      </div>
                      {it.highlight && (
                        <Heart
                          size={24}
                          className="text-red-500 animate-pulse"
                        />
                      )}
                    </div>
                    <p className="mt-3 text-sm text-gray-700">{it.text}</p>
                  </div>
                </motion.div>
              ))
            : [
                {
                  title: "Kenalan",
                  when: "2018",
                  text: "Ketemu di kafe dekat kampus. Dari obrolan ringan sampai akhirnya sering ketemu.",
                },
                {
                  title: "Jadian",
                  when: "2019",
                  text: "Mulai pacaran setelah beberapa bulan PDKT yang penuh deg-degan.",
                },
                {
                  title: "Lamaran",
                  when: "2024",
                  text: "Lamaran sederhana di rumah keluarga dengan penuh kebahagiaan.",
                },
                {
                  title: "Menikah",
                  when: "2025",
                  text: "Akhirnya resmi mengikat janji suci dan memulai perjalanan hidup bersama ❤️",
                  highlight: true,
                },
              ].map((it, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  className={`relative w-full md:w-1/2 ${
                    idx % 2 === 0
                      ? "md:pr-10 md:text-right"
                      : "md:pl-10 md:ml-auto"
                  }`}
                >
                  {/* Titik di timeline */}
                  <div
                    className={`absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${background[T].cta} shadow-lg border-4 border-white z-10`}
                  ></div>
                  {/* Card */}
                  <div
                    className={`p-5 rounded-2xl shadow-lg border ${background[T].border} ${background[T].card} bg-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg">{it.title}</h4>
                        <p className="text-xs text-gray-500">{it.when}</p>
                      </div>
                      {it.highlight && (
                        <Heart
                          size={24}
                          className="text-red-500 animate-pulse"
                        />
                      )}
                    </div>
                    <p className="mt-3 text-sm text-gray-700">{it.text}</p>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </motion.section>
  );
}
