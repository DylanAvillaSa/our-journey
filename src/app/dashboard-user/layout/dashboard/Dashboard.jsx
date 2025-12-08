"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Dashboard = ({
  activeMenu,
  templates,
  selectedCategory,
  setSelectedCategory,
  setSelectedTemplate,
}) => {
  const router = useRouter();

  return (
    <>
      {activeMenu === "dashboard" && (
        <>
          {/* Switch Buttons */}
          <div className="flex justify-center gap-4 mt-10">
            {["Silver", "Gold", "Platinum"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Templates */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {templates?.map((tpl) => (
              <motion.div
                key={tpl.id}
                whileHover={{ scale: 1.03 }}
                className="relative cursor-pointer rounded-xl overflow-hidden shadow-md bg-gray-100 flex flex-col items-center w-[220px] sm:w-[250px] md:w-[200px]"
              >
                <div className="w-full h-[220px] sm:h-[250px] md:h-[200px] relative">
                  <Image
                    src={tpl.src}
                    alt={tpl.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-contain"
                  />
                </div>
                <span className="text-center font-semibold mt-2">
                  {tpl.name}
                </span>

                <div className="flex gap-2 mt-3 mb-3 w-full px-4">
                  <button
                    onClick={() => router.push(tpl.link)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Live Preview
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTemplate(tpl);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
