"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TheDate({ background, theme, datamempelai }) {
  // Ambil tanggal & waktu dari database
  const rawDate = datamempelai?.countdownDate || "2025-12-14";
  const rawTime = datamempelai?.countdownTime || "19:00";

  // Gabungkan ke ISO string yang valid
  const finalDateString = `${rawDate}T${rawTime}:00`;

  // Buat target date
  const targetDate = new Date(finalDateString);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown(); // biar tidak delay 1 detik

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [finalDateString]);

  return (
    <>
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-serif text-center tracking-wide mb-6"
      >
        THE DATE
      </motion.h2>

      {/* Countdown Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className={`bg-gradient-to-r ${background[theme].chip} ${background[theme].cta} text-white rounded-lg shadow-md flex justify-around py-4 text-center mb-10`}
      >
        <div>
          <p className="text-3xl font-bold">{timeLeft.days}</p>
          <p className="text-sm">Day(s)</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{timeLeft.hours}</p>
          <p className="text-sm">Hour(s)</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{timeLeft.minutes}</p>
          <p className="text-sm">Minute(s)</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{timeLeft.seconds}</p>
          <p className="text-sm">Second(s)</p>
        </div>
      </motion.div>
    </>
  );
}
