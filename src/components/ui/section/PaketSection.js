"use client";

import { motion } from "framer-motion";

const paket = [
  {
    name: "Silver",
    price: "Rp. 200.000",
    features: ["Tampilan elegan", "Photo Slider (4)", "Template (2)"],
    accent: "from-[#D7D7D7] to-[#AFAFAF]",
  },
  {
    name: "Gold",
    price: "Rp. 300.000",
    features: ["Semua fitur Silver", "Photo Slider (8)", "Photo Gallery (16)"],
    accent: "from-[#FAD961] to-[#F76B1C]",
    popular: true,
  },
  {
    name: "Platinum",
    price: "Rp. 1.000.000",
    features: ["Semua fitur Gold", "Custom Tema", "Ucapan Video"],
    accent: "from-[#E0C3FC] to-[#8EC5FC]",
  },
];

const PaketSection = () => {
  return (
    <section className="px-6 md:px-24 py-20  from-[#FEF9C3] to-[#FEE2E2]">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-14">
        Pilihan Paket
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {paket.map((p, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6 }}
            className="relative rounded-2xl shadow-lg bg-white/90 backdrop-blur-md p-6 flex flex-col justify-between border border-gray-200"
          >
            {p.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                ⭐ Paling Populer
              </span>
            )}
            <div>
              <h3
                className={`text-2xl font-bold mb-2  ${p.accent} bg-clip-text text-transparent`}
              >
                {p.name}
              </h3>
              <p className="font-semibold mb-4">{p.price}</p>
              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                {p.features.map((f, idx) => (
                  <li key={idx}>✅ {f}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PaketSection;
