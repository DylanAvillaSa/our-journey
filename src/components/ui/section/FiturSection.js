"use client";
import { motion } from "framer-motion";

const fitur = [
  {
    title: "Desain Premium",
    desc: "Template minimalis & elegan dengan sentuhan modern.",
  },
  {
    title: "100% Digital",
    desc: "Sebar undangan lewat WhatsApp, Instagram, atau Email.",
  },
  {
    title: "Galeri & Musik",
    desc: "Tampilkan foto kenangan & lagu favoritmu.",
  },
];

const FiturSection = () => {
  return (
    <section className="px-6 md:px-24 py-20 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12">
        ✨ Fitur Unggulan
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {fitur.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-green-50 rounded-2xl text-center shadow-md hover:shadow-xl transition"
          >
            <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FiturSection;
