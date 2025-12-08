"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Countdown({ date, waktu }) {
  // DEFAULT kalau tidak ada di database
  const safeDate = date && date.trim() !== "" ? date : getDefaultDate(); // 7 hari dari sekarang
  const safeWaktu = waktu && waktu.trim() !== "" ? waktu : "09:00";

  function getDefaultDate() {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  }

  const calculateTimeLeft = () => {
    const [year, month, day] = safeDate.split("-").map(Number);
    const [hour, minute] = safeWaktu.split(":").map(Number);

    const eventDate = new Date(year, month - 1, day, hour, minute, 0);
    const now = new Date();
    let diff = eventDate - now;

    // tolerance 2 menit
    if (diff < 0 && Math.abs(diff) < 120000) {
      diff = 0;
    }

    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [date, waktu]);

  if (!timeLeft) {
    return (
      <p className="text-center text-lg font-semibold text-green-600">
        Acara sudah dimulai 🎉
      </p>
    );
  }

  const flipVariant = {
    initial: { opacity: 0, y: -20, rotateX: -90 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
    exit: { opacity: 0, y: 20, rotateX: 90 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-2xl mx-auto py-10"
    >
      <h3 className="text-center text-lg md:text-xl font-bold mb-6">
        Menuju Hari Bahagia
      </h3>

      <div className="grid grid-cols-4 gap-4 text-center">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div
            key={unit}
            className="p-4 rounded-2xl shadow bg-white text-black"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={value}
                variants={flipVariant}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-4xl font-bold"
              >
                {value}
              </motion.p>
            </AnimatePresence>
            <p className="text-sm text-gray-600 capitalize">{unit}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
