"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Calendar, Grid, UserCheck } from "lucide-react";

export default function BottomNavigation({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  const toggle = () => setOpen((s) => !s);

  const navVariants = {
    hidden: { opacity: 0, y: 10, transition: { duration: 0.25 } },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut", staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const handleClick = (id) => {
    setActive(id);
    setOpen(false);
    onNavigate?.(id);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative flex items-center justify-center px-4 py-2 rounded-full
         ${
           open &&
           "from-amber-900/60 to-amber-700/60 border backdrop-blur-md bg-gradient-to-r border-amber-400/20 shadow-[0_3px_15px_rgba(0,0,0,0.25)]"
         }  `}
      >
        {/* Navigasi muncul ketika open */}
        <AnimatePresence>
          {open && (
            <motion.div
              variants={navVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center justify-center gap-4"
            >
              {[
                { id: "love", icon: Heart },
                { id: "kalender", icon: Calendar },
                { id: "galeri", icon: Grid },
                { id: "rsvp", icon: UserCheck },
              ].map(({ id, icon: Icon }) => (
                <motion.button
                  key={id}
                  variants={itemVariants}
                  onClick={() => handleClick(id)}
                  className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                    active === id
                      ? "text-amber-300 scale-110"
                      : "text-amber-100 hover:text-amber-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tombol utama */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <motion.button
            onClick={toggle}
            aria-expanded={open}
            className="relative w-[50px] h-[50px] rounded-full bg-gradient-to-br from-amber-100 to-amber-50
            flex items-center justify-center shadow-[0_4px_15px_rgba(255,193,7,0.35)]
            hover:shadow-[0_4px_20px_rgba(255,193,7,0.45)] transition-all duration-200 active:scale-95 overflow-hidden"
            whileTap={{ scale: 0.95 }}
          >
            {/* Light sweep */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%]"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
            />

            {/* Dots (saat tertutup) */}
            <AnimatePresence>
              {!open && (
                <motion.div
                  className="flex items-center justify-center gap-[4px] z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-[4px] h-[4px] rounded-full bg-amber-800"
                      animate={{
                        y: [0, -2, 0],
                        opacity: [1, 0.8, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* X icon (saat terbuka) */}
            <AnimatePresence>
              {open && (
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  className="z-10 text-amber-800"
                  initial={{ opacity: 0, scale: 0.7, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.7, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    d="M6 6L18 18M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </motion.svg>
              )}
            </AnimatePresence>

            {/* Pulse efek halus */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-amber-400/25 pointer-events-none"
            />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
