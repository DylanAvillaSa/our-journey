import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CountdownAkad() {
  const targetDate = new Date("2025-10-23T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const countdownData = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="flex gap-3 md:gap-6 mb-10"
    >
      {countdownData.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="flex flex-col items-center justify-center bg-white/90 backdrop-blur-md rounded-xl shadow-md w-20 md:w-28 h-20 md:h-24 border border-[#d6c4a3]"
        >
          <span className="text-2xl md:text-3xl font-bold text-[#7a5c3a]">
            {item.value.toString().padStart(2, "0")}
          </span>
          <span className="text-sm md:text-base text-[#7a5c3a]">
            {item.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
