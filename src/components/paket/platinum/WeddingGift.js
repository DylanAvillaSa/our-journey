"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HomeIcon } from "lucide-react";
import { fonts } from "@/app/layout";

export default function WeddingGift() {
  const [showRekening, setShowRekening] = useState(false);
  const [copied, setCopied] = useState(null);

  const cards = [
    {
      bank: "BRI",
      account: "013201099751504",
      name: "RIA MARIANA",
      colors: {
        from: "from-[#092b62]",
        to: "to-[#2b6cb0]",
        text: "text-white",
      },
      logoLetters: "BRI",
    },
  ];

  const handleCopy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s+/g, ""));
      setCopied(key);
      setTimeout(() => setCopied((prev) => (prev === key ? null : prev)), 1600);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = value.replace(/\s+/g, "");
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(key);
      setTimeout(() => setCopied((prev) => (prev === key ? null : prev)), 1600);
    }
  };

  return (
    <section
      className={`w-full flex flex-col items-center justify-center gap-10 px-4 py-16  bg-cover bg-center relative`}
    >
      {/* <div className="absolute inset-0 bg-[#f9f4ef]/70 z-0" /> */}

      {/* Wedding Gift Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="relative w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl border border-[#b89c7c] bg-[#f9f4ef]/90 flex flex-col items-center p-6 sm:p-8 text-center shadow-lg mx-auto"
      >
        <h2
          className={`text-3xl sm:text-4xl font-[cursive] text-[#6b4b3e] mb-3 sm:mb-4 ${fonts.greatVibes.className}`}
        >
          Wedding Gift
        </h2>
        <p
          className={`text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 ${fonts.playfair.className}`}
        >
          Bagi Bapak/Ibu/Saudara/i yang ingin mengirimkan hadiah pernikahan
          dapat melalui virtual account atau e-wallet di bawah ini:
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowRekening(!showRekening)}
          className="bg-[#b89c7c] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full flex items-center justify-center gap-2 shadow-md hover:bg-[#9e8368] transition"
        >
          🎁 Klik Disini
        </motion.button>
        <AnimatePresence>
          {/* Kartu Rekening */}
          {showRekening && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 sm:mt-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 justify-items-center"
            >
              {cards.map((c) => (
                <motion.div
                  key={c.bank}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="w-full max-w-sm sm:max-w-md md:max-w-lg relative rounded-2xl shadow-xl overflow-hidden"
                >
                  <div
                    className={`p-4 sm:p-6 rounded-2xl ${c.colors.text} bg-white/10 backdrop-blur-sm border border-white/20 relative`}
                    style={{
                      minHeight: 140,
                      backgroundImage:
                        "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                    }}
                  >
                    {/* Logo ATM di atas kanan */}
                    <div className="absolute top-4 right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/30 backdrop-blur flex items-center justify-center font-bold text-xs sm:text-sm shadow-md">
                      <span
                        className={
                          c.colors.from === "from-[#092b62]"
                            ? "text-[#0b3a89]"
                            : "text-[#b34700]"
                        }
                      >
                        {c.logoLetters}
                      </span>
                    </div>

                    {/* Chip */}
                    <div className="w-12 h-8 sm:w-14 sm:h-10 rounded-md bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-md mb-4"></div>

                    {/* Info Bank */}
                    <div className="mt-2 text-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                      <div>
                        <div className="text-base sm:text-lg font-semibold tracking-wide">
                          {c.bank}
                        </div>
                        <div
                          className="mt-2 text-lg sm:text-xl font-medium tracking-widest select-all"
                          style={{
                            letterSpacing: "0.2em",
                            textShadow:
                              "0 1px 0 rgba(255,255,255,0.12), 0 -1px 0 rgba(0,0,0,0.12)",
                          }}
                        >
                          {c.account}
                        </div>
                        <div className="mt-1 text-xs sm:text-sm opacity-90">
                          <div className="text-[10px] sm:text-xs">
                            Atas Nama
                          </div>
                          <div className="font-medium text-sm sm:text-base">
                            {c.name}
                          </div>
                        </div>
                      </div>

                      {/* Tombol Salin */}
                      <div className="flex flex-col items-end gap-1 sm:gap-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => handleCopy(c.account, c.bank)}
                          className="inline-flex items-center gap-1 rounded-full bg-white/10 backdrop-blur px-2 py-0.5 text-[10px] sm:text-xs font-medium border border-white/20 hover:bg-white/20 transition"
                        >
                          {copied === c.bank ? "✅ Copied" : "Salin"}
                        </button>
                      </div>
                    </div>

                    {/* Glossy effect */}
                    <div
                      className="pointer-events-none absolute -top-10 -left-20 w-40 h-40 rounded-full opacity-10"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), rgba(255,255,255,0.05) 30%, transparent 40%)",
                        transform: "rotate(10deg)",
                      }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Kartu Alamat */}
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full max-w-sm sm:max-w-md md:max-w-lg relative rounded-2xl shadow-xl overflow-hidden"
              >
                <div
                  className="p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 relative"
                  style={{
                    minHeight: 120,
                    backgroundImage:
                      "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                  }}
                >
                  <h3 className="text-base sm:text-lg flex items-center gap-2 justify-center font-semibold text-gray-800 mb-2">
                    <HomeIcon />
                    Alamat Gift
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 text-center">
                    Kp.Talaga rt 002 rw 001 Desa.Karyalaksana Kec.Ibun
                    Kab.Bandung
                  </p>

                  <div
                    className="pointer-events-none absolute -top-10 -left-20 w-40 h-40 rounded-full opacity-10"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), rgba(255,255,255,0.05) 30%, transparent 40%)",
                      transform: "rotate(10deg)",
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
