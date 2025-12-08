"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";

export default function UcapanRSVP({ T, background }) {
  const [guestForm, setGuestForm] = useState({
    name: "",
    message: "",
    rsvp: "",
  });

  const [messages, setMessages] = useState([
    {
      name: "Andi",
      time: "2 jam lalu",
      message: "Selamat menempuh hidup baru 🎉",
      rsvp: "Hadir",
    },
    {
      name: "Sinta",
      time: "1 jam lalu",
      message: "Semoga menjadi keluarga sakinah mawaddah warahmah 🤲",
      rsvp: "Hadir",
    },
    {
      name: "Budi",
      time: "50 menit lalu",
      message: "Bahagia selalu ya!",
      rsvp: "Tidak Hadir",
    },
    {
      name: "Maya",
      time: "30 menit lalu",
      message: "Selamat ya, langgeng sampai tua 💕",
      rsvp: "Hadir",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages([{ ...guestForm, time: "Baru saja" }, ...messages]);
    setGuestForm({ name: "", message: "", rsvp: "" });
    setCurrentPage(1);
  };

  // Hitung jumlah hadir & tidak hadir
  const { hadirCount, tidakHadirCount } = useMemo(() => {
    let hadir = 0,
      tidak = 0;
    messages.forEach((msg) => {
      if (msg.rsvp === "Hadir") hadir++;
      if (msg.rsvp === "Tidak Hadir") tidak++;
    });
    return { hadirCount: hadir, tidakHadirCount: tidak };
  }, [messages]);

  const totalPages = Math.ceil(messages.length / perPage);
  const displayed = messages.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12 px-6"
    >
      <h3
        className={`text-center font-bold text-2xl md:text-3xl mb-8 ${background[T].textMain}`}
      >
        Ucapan, Doa & Konfirmasi Kehadiran
      </h3>

      <div className="max-w-lg mx-auto">
        {/* Form Card */}
        <div
          className={`p-6 rounded-2xl border ${background[T].border} ${background[T].card} shadow mb-8`}
        >
          <h4 className="font-semibold mb-4 text-center">
            Tulis Ucapan & Konfirmasi Kehadiran
          </h4>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={guestForm.name}
              onChange={(e) =>
                setGuestForm((s) => ({ ...s, name: e.target.value }))
              }
              placeholder="Nama Anda"
              className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              required
            />
            <textarea
              value={guestForm.message}
              onChange={(e) =>
                setGuestForm((s) => ({ ...s, message: e.target.value }))
              }
              placeholder="Ucapan & Doa"
              className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white h-28"
              required
            />
            <select
              value={guestForm.rsvp}
              onChange={(e) =>
                setGuestForm((s) => ({ ...s, rsvp: e.target.value }))
              }
              className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              required
            >
              <option value="">-- Konfirmasi Kehadiran --</option>
              <option value="Hadir">Hadir</option>
              <option value="Tidak Hadir">Tidak Hadir</option>
            </select>
            <button
              type="submit"
              className={`mt-2 py-3 rounded-full text-white shadow ${background[T].cta}`}
            >
              Kirim
            </button>
          </form>
        </div>
      </div>

      {/* Statistik Kehadiran */}
      <div className="max-w-md mx-auto mt-8 grid grid-cols-2 gap-4 mb-8">
        <div className="p-6 rounded-2xl shadow bg-slate-50 text-center">
          <p className="text-lg font-bold text-green-700">{hadirCount}</p>
          <p className="text-sm text-green-600">Hadir</p>
        </div>
        <div
          className={`p-6 rounded-2xl shadow ${background[T].chip} text-center`}
        >
          <p className="text-lg font-bold text-rose-400">{tidakHadirCount}</p>
          <p className="text-sm text-red-600">Tidak Hadir</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Ucapan Card */}
        <div
          className={`p-6 rounded-2xl border ${background[T].border} ${background[T].card} shadow`}
        >
          <h4 className="font-semibold mb-4 text-center">Ucapan & Doa</h4>
          <div className="space-y-4">
            {displayed.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-xl shadow border bg-white"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{msg.name}</p>
                  {msg.rsvp && (
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        msg.rsvp === "Hadir"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {msg.rsvp}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">{msg.time}</p>
                <p className="text-gray-800">{msg.message}</p>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-full text-sm transition ${
                    currentPage === i + 1
                      ? `${background[T].cta} text-white`
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
