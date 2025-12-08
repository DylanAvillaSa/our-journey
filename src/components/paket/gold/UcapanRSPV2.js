"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function UcapanRSVP2({ T, background }) {
  const [messages, setMessages] = useState([
    {
      name: "Andi & Keluarga",
      message: "Selamat menempuh hidup baru! Semoga sakinah mawaddah warahmah.",
    },
    {
      name: "Dewi",
      message: "Ikut bahagia! Semoga langgeng sampai akhir hayat.",
    },
  ]);

  const [form, setForm] = useState({ name: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.message) {
      setMessages([...messages, { ...form }]);
      setForm({ name: "", message: "" });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative py-16 px-6"
    >
      {/* Frame */}
      <div
        className={`absolute inset-0 rounded-2xl border-4 ${background[T].border} shadow-2xl pointer-events-none`}
      />

      {/* Judul */}
      <h3
        className={`relative text-center font-[--playfair] text-3xl md:text-4xl mb-12 ${background[T].textMain}`}
      >
        Ucapan & RSVP
      </h3>

      <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        {/* ===== List Ucapan ===== */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-h-[400px] overflow-y-auto pr-2"
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/70 backdrop-blur-md rounded-xl p-5 shadow-md border border-gray-200"
            >
              <p className="text-gray-800 font-semibold">{msg.name}</p>
              <p className="text-gray-600 text-sm mt-1">{msg.message}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== Form RSVP ===== */}
        <motion.form
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h4 className="text-lg font-semibold mb-4 text-center text-gray-800">
            Tinggalkan Ucapan
          </h4>

          <input
            type="text"
            placeholder="Nama Anda"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <textarea
            placeholder="Ucapan & Doa"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          ></textarea>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`${background[T].cta} w-full py-2 rounded-lg text-white font-semibold shadow-md`}
          >
            Kirim Ucapan
          </motion.button>
        </motion.form>
      </div>
    </motion.section>
  );
}
