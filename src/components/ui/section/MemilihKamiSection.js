"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    icon: "⚡",
    title: "Cepat & Mudah",
    desc: "Undangan siap dibagikan hanya beberapa klik.",
  },
  {
    icon: "💌",
    title: "Custom Nama Tamu",
    desc: "Personalisasi undangan agar lebih berkesan.",
  },
  {
    icon: "💸",
    title: "Harga Transparan",
    desc: "Tanpa biaya tersembunyi, harga jelas.",
  },
  {
    icon: "🔄",
    title: "Gratis Revisi",
    desc: "Revisi desain sepuasnya sesuai kebutuhanmu.",
  },
];

const MemilihKamiSection = () => {
  return (
    <section className="px-6 md:px-24 py-20 bg-white">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-14">
        💡 Kenapa Pilih Kami?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {reasons.map((r, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="flex items-start gap-4 p-6 bg-green-50 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="text-3xl">{r.icon}</div>
            <div>
              <h3 className="text-xl font-semibold mb-1">{r.title}</h3>
              <p className="text-gray-600">{r.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MemilihKamiSection;
