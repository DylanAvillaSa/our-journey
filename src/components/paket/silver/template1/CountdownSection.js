// components/counter/CountDown.js
"use client";

import { useEffect, useState } from "react";

export default function CountdownSection({ date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Tanggal pernikahan
  const weddingDate = new Date(date || "2025-08-15T13:30:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = weddingDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mt-16 flex flex-col items-center text-center">
      <h2 className="text-2xl font-semibold mb-4">Countdown to Our Wedding</h2>
      <div className="flex gap-4 text-[#A47148] text-xl font-semibold">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-lg shadow border border-yellow-300">
          <p className="text-3xl">{timeLeft?.days || 0}</p>
          <span className="text-sm">Hari</span>
        </div>
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-lg shadow border border-yellow-300">
          <p className="text-3xl">{timeLeft?.hours || 0}</p>
          <span className="text-sm">Jam</span>
        </div>
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-lg shadow border border-yellow-300">
          <p className="text-3xl">{timeLeft?.minutes || 0}</p>
          <span className="text-sm">Menit</span>
        </div>
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-lg shadow border border-yellow-300">
          <p className="text-3xl">{timeLeft?.seconds || 0}</p>
          <span className="text-sm">Detik</span>
        </div>
      </div>
    </section>
  );
}
