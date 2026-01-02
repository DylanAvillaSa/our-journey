"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Mail, Instagram } from "lucide-react";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/libs/config";
import { CalendarDays } from "lucide-react";
import { fonts } from "@/app/layout";
import { PauseCircle, PlayCircle } from "lucide-react";
import BottomNavigation from "@/components/ui/BottomNavigation";
import { useSearchParams } from "next/navigation";

// ===== Dummy Messages (Ucapan & Doa) =====
const dummyData = [
  {
    nama: "Alya Rahma",
    kehadiran: "hadir",
    ucapan: "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah 💕",
    waktu: "21 Oktober 2025, 10:15",
  },
  {
    nama: "Rafi Pratama",
    kehadiran: "tidak hadir",
    ucapan: "Maaf belum bisa hadir, tapi doa terbaik selalu untuk kalian!",
    waktu: "21 Oktober 2025, 10:30",
  },
  {
    nama: "Mira Dewi",
    kehadiran: "hadir",
    ucapan: "Selamat menempuh hidup baru! Bahagia selalu 💍",
    waktu: "21 Oktober 2025, 11:05",
  },
];

// ===== Variasi Warna (2 Tema Baru, tanpa Emerald) =====
export const THEMES = {
  sunset: {
    pageBg:
      "bg-[radial-gradient(1400px_900px_at_10%_-10%,#fff4ed,transparent),radial-gradient(1400px_900px_at_90%_0%,#fff7f0,transparent)] bg-[#fffdfc]",
    headerGrad: "bg-gradient-to-r from-orange-700 via-red-500 to-pink-500",
    card: "bg-gradient-to-br from-[#fff7f5]/90 via-[#fff0eb]/80 to-[#fff8f3]/90 backdrop-blur-lg",
    border: "border-orange-400",
    textMain: "text-orange-900",
    cta: "bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 hover:from-orange-600 hover:to-red-500",
    chip: "bg-orange-100 text-orange-800",
  },

  // 🌌 Royal Purple & Gold
  royal: {
    pageBg:
      "bg-[radial-gradient(1400px_900px_at_20%_-10%,#f5f3ff,transparent),radial-gradient(1400px_900px_at_90%_0%,#faf5ff,transparent)] bg-[#fcfbff]",
    headerGrad: "bg-gradient-to-r from-purple-900 via-violet-700 to-indigo-600",
    card: "bg-gradient-to-br from-[#faf5ff]/90 via-[#f3e8ff]/80 to-[#ede9fe]/90 backdrop-blur-lg",
    border: "border-violet-400",
    textMain: "text-purple-900",
    cta: "bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-500 hover:from-violet-600 hover:to-purple-500",
    chip: "bg-violet-100 text-violet-800",
  },
  // 🔹 Varian 3: Rose Gold & Champagne
  roseGold: {
    pageBg:
      "bg-[radial-gradient(1400px_900px_at_30%_-20%,#fff5f5,transparent),radial-gradient(1400px_900px_at_90%_0%,#fffaf5,transparent)] bg-[#fffdfc]",
    headerGrad: "bg-gradient-to-r from-pink-600 via-rose-500 to-amber-400",
    card: "bg-gradient-to-br from-[#fffaf8]/90 via-[#fff5f3]/80 to-[#fff0ec]/90 backdrop-blur-lg",
    border: "border-rose-300",
    textMain: "text-rose-900",
    cta: "bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 hover:from-rose-500 hover:to-pink-400",
    chip: "bg-rose-100 text-rose-800",
  },
};

export default function PlatinumTemplate15({ id, data: datas }) {
  const rsvpRef = useRef(null);
  const audioRef = useRef(null);
  const searchParams = useSearchParams();
  const namaTamu = searchParams.get("to");
  const [switcher, setSwitcher] = useState(false);
  const [dataMempelai, setDataMempelai] = useState(datas || null);
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [theme, setTheme] = useState("sunset");
  const [formData, setFormData] = useState({
    nama: "",
    kehadiran: "",
    ucapan: "",
  });
  const [data, setData] = useState(dummyData);
  const totalHadir = data.filter((d) => d.kehadiran === "hadir").length;
  const totalTidakHadir = data.filter(
    (d) => d.kehadiran === "tidak hadir"
  ).length;
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("msgs_v1");
      return raw && JSON.parse(raw);
    } catch (e) {
      return "";
    }
  });
  const [guestForm, setGuestForm] = useState({ name: "", message: "" });
  const videoRef = useRef(null);
  const videoRef2 = useRef(null);
  const [showBackgroundVideo, setShowBackgroundVideo] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const rekeningList = [
    {
      id: 1,
      bank: "BCA",
      nomor: "1234567890",
      nama: "Dylan Avilla",
      logo: "/asset/platinum/tema-merak/bca.png",
    },
  ];
  const combined = `${dataMempelai?.countdownDate}T${dataMempelai?.countdownTime}`;
  const TARGET_DATE = new Date(combined || "2025-12-21T10:00:00");
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(TARGET_DATE));
  const [finished, setFinished] = useState(false);
  const [showBingkaiNama, setShowBingkaiNama] = useState(true);
  const [isBgVideoDone, setIsBgVideoDone] = useState(false);

  // mengambil data dari database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ambil data berdasarkan email atau template
        const q = query(
          collection(db, "pembelian"),
          where("template", "==", "Platinum 3"),
          where("status_pembayaran", "==", "lunas")
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty && id !== undefined) {
          const doc = querySnapshot.docs[0].data();
          setDataMempelai(doc.dataMempelai);
          setTheme(doc.dataMempelai.temaWarna || "sunset");
        } else {
          console.log("❌ Tidak ada data ditemukan untuk template ini");
        }
      } catch (err) {
        console.error("Gagal ambil data Firestore:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // ⛔ Jangan izinkan scroll hide/show sebelum video selesai!
      if (!isBgVideoDone) return;

      if (window.scrollY > 50) {
        setShowBingkaiNama(false);
      } else {
        setShowBingkaiNama(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isBgVideoDone]); // ⬅ penting, tunggu video selesai

  useEffect(() => {
    const t = setInterval(() => {
      const remaining = getTimeRemaining(TARGET_DATE);
      setTimeLeft(remaining);
      if (
        remaining.days === 0 &&
        remaining.hours === 0 &&
        remaining.minutes === 0 &&
        remaining.seconds === 0
      ) {
        setFinished(true);
        clearInterval(t);
      }
    }, 1000);

    return () => clearInterval(t);
  }, [TARGET_DATE]);

  const handleVideoEnd = () => {
    // Saat video pembuka selesai, tampilkan background video
    setShowBackgroundVideo(true);
  };

  const T = THEMES[theme];
  const ref = useRef(null);
  const [guestBook, setGuestBook] = useState([]);
  const [showGift, setShowGift] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ref.current) setTarget(ref.current);
  }, []);

  const handleOpen = () => setOpened(true);

  useEffect(() => {
    if (opened && rsvpRef.current) {
      setTimeout(() => {
        rsvpRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 900);
    }
  }, [opened]);

  useEffect(() => {
    localStorage.setItem("msgs_v1", JSON.stringify(messages));
  }, [messages]);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const addGuestMessage = (e) => {
    e.preventDefault();
    if (!guestForm.name || !guestForm.message) return;
    const newMsg = {
      name: guestForm.name,
      time: new Date().toISOString().slice(0, 19).replace("T", " "),
      message: guestForm.message,
    };
    setMessages((s) => [newMsg, ...s]);
    setGuestForm({ name: "", message: "" });
  };

  const handleSaveDate = () => {
    // Tanggal event harus string ISO: "2025-11-25T08:00:00"
    const startDate = new Date("2025-11-25T08:00:00");
    const endDate = new Date("2025-11-25T11:00:00");

    if (isNaN(startDate) || isNaN(endDate)) {
      alert("Tanggal event tidak valid!");
      return;
    }

    const formatForGoogle = (date) =>
      date.toISOString().replace(/-|:|\.\d{3}/g, "") + "Z";

    const start = formatForGoogle(startDate);
    const end = formatForGoogle(endDate);

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      "Vidi & Riffany Wedding"
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      "Acara pernikahan kami"
    )}&location=${encodeURIComponent("Masjid Al-Falah, Jakarta Selatan")}`;

    window.open(url, "_blank");
  };

  const images = [
    "/images/family.jpg",
    "/images/tmp.jpg",
    "/images/bg-wedding.jpg",
  ]; // ganti sesuai foto pasangan lu

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main
      className={`min-h-screen ${T.pageBg} relative overflow-hidden`}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {/* ===== Musik Latar + Controller ===== */}
      <audio
        ref={audioRef}
        autoPlay
        loop
        src={dataMempelai?.backsound || "/bg-wedding.mp3"}
        className="hidden"
      />

      {/* Welcome Screen */}
      <AnimatePresence>
        {!opened && (
          <motion.section
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-black"
          >
            {/* 🏔️ Background Layer dengan Blur */}
            <div className="absolute inset-0">
              <Image
                src="/asset/platinum/tema-travel/latar-belakang-pembuka.png"
                alt="Gunung Senja"
                fill
                priority
                className="object-cover opacity-70 scale-105 blur-xs"
              />

              {/* Lapisan Gradasi + efek blur lembut */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-rose-900/50 backdrop-blur-[80%] mix-blend-overlay" />
            </div>

            {/* ✨ Animated Light Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1.3, 0.8],
                  }}
                  transition={{
                    duration: 5 + Math.random() * 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* 💫 Floating Rings */}
            <motion.div
              className="absolute -bottom-10 right-10 w-40 h-40 border border-white/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -bottom-20 right-20 w-24 h-24 border border-rose-400/40 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            />

            {/* 💍 Center Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative z-10 max-w-lg w-full px-6"
            >
              {/* 🖼️ Foto Mempelai */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="relative mx-auto w-40 h-[14rem] md:w-48 md:h-[14rem] mb-6 rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(255,192,203,0.4)] border-4 border-transparent bg-gradient-to-tr from-rose-400 via-pink-300 to-yellow-200 p-[2px]"
              >
                <div className="w-full h-full rounded-md overflow-hidden bg-white">
                  <Image
                    src={dataMempelai?.fotoSampul[0] || "/images/prewed-1.jpg"}
                    alt="Foto Mempelai"
                    fill
                    className="object-cover scale-105"
                  />
                </div>

                {/* efek glow halus */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-rose-100/20 to-transparent" />
              </motion.div>

              {/* ✨ The Wedding Of */}
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white text-sm md:text-base tracking-[5px] uppercase mb-3 font-[var(--font-serif)]"
              >
                The Wedding Of
              </motion.p>

              {/* 🕊️ Nama Mempelai */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="font-[var(--font-vibes)] text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-orange-200 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] mb-4"
              >
                {dataMempelai?.panggilanPria || "Putra"} &{" "}
                {dataMempelai?.panggilanWanita || "Putri"}
              </motion.h1>

              {/* 📅 Tanggal */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-white/90 text-lg md:text-xl mb-8 font-[var(--font-playfair)]"
              >
                {dataMempelai?.tanggalAkad || "12 • 12 • 2023"}
              </motion.p>

              {/* 💌 Guest Name */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <p className="text-white text-sm md:text-base mb-2 tracking-wide">
                  Kepada Yth:
                </p>
                <motion.p
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-2xl font-semibold text-rose-700 bg-white/90 rounded-xl w-[240px] mx-auto py-1 shadow-md backdrop-blur-md"
                >
                  {namaTamu || "Nama Tamu"}
                </motion.p>
                <p className="text-white text-sm md:text-base mt-2">
                  Di Tempat
                </p>
              </motion.div>

              {/* 🕯️ Open Button */}
              <motion.button
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="bg-gradient-to-r from-rose-500 via-pink-400 to-orange-300 text-white px-8 py-3 rounded-full font-semibold tracking-wide shadow-lg mt-10 flex items-center gap-2 mx-auto hover:shadow-rose-400/60 transition-all duration-500"
              >
                <Mail className="w-5 h-5" /> Buka Undangan
              </motion.button>
            </motion.div>

            {/* 🌙 Bottom Glow */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black via-transparent to-transparent" />
          </motion.section>
        )}
      </AnimatePresence>

      {/* ===== UNDANGAN LENGKAP ===== */}
      {opened && (
        <div className="relative w-full min-h-screen overflow-y-auto">
          <AnimatePresence>
            {/* animasi */}
            <motion.div
              className="inset-0 fixed w-full h-full z-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              {/* ===== Video Animasi Pembuka ===== */}
              {!showBackgroundVideo && (
                <motion.div
                  className="relative w-full h-full overflow-hidden flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                >
                  <video
                    ref={videoRef}
                    src="/animasi-pembuka-template-15.mp4"
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleVideoEnd}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}

              {/* ===== Video Background ===== */}
              {showBackgroundVideo && (
                <motion.div
                  className="relative w-full h-full overflow-hidden flex items-center justify-center opacity-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  <video
                    ref={videoRef2}
                    src="/animasi-pembuka-template-15-2.mp4"
                    autoPlay
                    muted
                    playsInline
                    onEnded={(e) => {
                      setIsBgVideoDone(true);
                    }}
                    className="w-full h-full object-cover"
                  />

                  {/* Ornamen Background */}
                  {isBgVideoDone && (
                    <motion.img
                      src="/asset/platinum/tema-travel/latar-nama.png"
                      alt="Ornament kanan bawah"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-auto md:w-[500px] animate-float-slow"
                      animate={{
                        opacity: showBingkaiNama ? 1 : 0,
                        scale: showBingkaiNama ? 1 : 0.95,
                      }}
                    />
                  )}

                  {/* Overlay teks */}

                  {isBgVideoDone && (
                    <motion.div
                      className="absolute inset-0 w-1/2 mx-auto flex flex-col items-center justify-center text-pink-400 bottom-4"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: showBingkaiNama ? 1 : 0,
                        scale: showBingkaiNama ? 1 : 0.95,
                        y: showBingkaiNama ? 0 : -30,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <motion.h1
                        className="text-sm md:text-6xl font-bold tracking-wide drop-shadow-lg"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                      >
                        <span className="text-pink-400 text-xl">
                          The Wedding Of
                        </span>
                      </motion.h1>

                      <motion.div
                        className="text-2xl md:text-5xl text-pink-400 text-center mt-1 font-light flex flex-col drop-shadow-md"
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                      >
                        <p>{dataMempelai?.panggilanPria || "Putra"}</p>
                        <span>&</span>
                        <p>{dataMempelai?.panggilanWanita || "Putri"}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ======== Bagian Konten yang Bisa di Scroll ======== */}
          {showBackgroundVideo && (
            <div className="relative z-10 flex flex-col items-center justify-center text-center text-gray-800 mt-[100vh] mx-3">
              {isBgVideoDone && (
                <>
                  <BottomNavigation onNavigate={scrollToSection} />
                  {/* Floating controls: audio, theme, dark */}
                  <div className="fixed z-50 bottom-4 right-4">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleAudio}
                      className={`p-3 rounded-full shadow-lg ${
                        T.cta
                      } text-white flex items-center justify-center group ${
                        isPlaying && "opacity-35"
                      }`}
                      aria-label="Toggle Music"
                    >
                      {isPlaying ? (
                        <PauseCircle size={22} />
                      ) : (
                        <PlayCircle size={22} />
                      )}
                      {/* Tooltip */}
                      <span className="absolute right-full mr-2 px-2 py-1 text-xs bg-black/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {isPlaying ? "Pause Music" : "Play Music"}
                      </span>
                    </motion.button>
                  </div>
                </>
              )}

              {/* ===== Pembukaan Surah Ar-Rum (Pink Elegant Theme) ===== */}
              <section className="relative overflow-hidden py-28 px-8 md:px-20 bg-gradient-to-b from-pink-100 via-rose-50 to-white rounded-t-[6rem]">
                {/* Ornamen Background Lembut */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Ornamen kanan bawah */}
                  <img
                    src="/asset/platinum/tema-travel/ornament-bunga.png"
                    alt="Ornament kanan bawah"
                    className="absolute bottom-0 right-0 w-52 md:w-80 opacity-60 animate-slowFloatReverse"
                  />
                  {/* Efek shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-pink-200/10 to-transparent animate-shimmer"></div>
                </div>

                {/* Ornamen bunga kecil bertebaran */}
                <div className="absolute inset-0">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-4 h-4 bg-pink-300/50 rounded-full blur-sm animate-float-slow`}
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 1.2}s`,
                      }}
                    ></div>
                  ))}
                </div>

                {/* Konten Utama */}
                <div className="relative text-center">
                  <motion.h2
                    className="text-3xl md:text-5xl font-extrabold text-pink-700 mb-8 tracking-wide drop-shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                  >
                    بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                  </motion.h2>

                  <motion.p
                    className="text-base md:text-2xl leading-relaxed italic text-gray-700 max-w-3xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                  >
                    “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
                    menciptakan untukmu pasangan-pasangan dari jenismu sendiri,
                    agar kamu cenderung dan merasa tenteram kepadanya, dan Dia
                    menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya
                    pada yang demikian itu benar-benar terdapat tanda-tanda bagi
                    kaum yang berpikir.”
                  </motion.p>

                  <motion.p
                    className="mt-6 text-pink-500 font-medium text-sm md:text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                  >
                    — QS. Ar-Rum : 21 —
                  </motion.p>

                  {/* Garis Ornamen */}
                  <motion.div
                    className="mt-10 mx-auto w-56 h-[3px] bg-gradient-to-r from-pink-300 via-rose-400 to-pink-300 rounded-full shadow-sm"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                </div>
              </section>

              {/* ===== Bagian Kedua Mempelai (Royal Blush Romance Theme) ===== */}
              <section className="relative py-28 px-6 md:px-16 mt-16 bg-gradient-to-br from-pink-300 via-rose-100/80 to-white rounded-t-[6rem] rounded-b-[6rem] overflow-hidden">
                {/* Background Ornamen Aesthetic */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Ornamen kiri atas */}
                  <img
                    src="/asset/platinum/tema-travel/ornament-bulat.png"
                    alt="Ornament kiri atas"
                    className="absolute top-0 left-0 w-64 md:w-[500px] opacity-30 animate-slowFloat"
                  />
                  {/* Ornamen kanan bawah */}
                  <img
                    src="/asset/platinum/tema-travel/ornament-love.png"
                    alt="Ornament kanan bawah"
                    className="absolute bottom-0 right-0 w-64 md:w-[500px] opacity-30 animate-slowFloatReverse"
                  />
                  {/* Efek shimmering lembut */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-pink-200/10 to-transparent animate-shimmer"></div>
                </div>

                {/* Bokeh Partikel */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(14)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-pink-300/40 rounded-full blur-[2px] animate-bokehFloat"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 1.5}s`,
                      }}
                    />
                  ))}
                </div>

                {/* ===== Judul & Pembuka ===== */}
                <motion.h3
                  className="text-3xl md:text-6xl font-bold text-pink-700 text-center mb-8 drop-shadow-sm font-[var(--font-vibes)]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  Assalamualaikum Warahmatullahi Wabarakatuh
                </motion.h3>

                <motion.p
                  className="text-gray-700 text-center max-w-3xl mx-auto leading-relaxed text-base md:text-xl font-light italic font-[var(--font-playfair)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                >
                  Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
                  untuk menyelenggarakan pernikahan putra-putri kami:
                </motion.p>

                {/* ===== Layout Kedua Mempelai ===== */}
                <div className="relative flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 mt-20">
                  {/* === Mempelai Pria === */}
                  <motion.div
                    className="relative w-full md:w-[320px] bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-6 text-center transform hover:-translate-y-2 transition-all duration-700 border border-pink-200/50"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full overflow-hidden ring-4 ring-pink-300 shadow-xl">
                      <img
                        src={
                          dataMempelai?.fotoMempelaiPria ||
                          "/foto-dummy/pria.png"
                        }
                        alt="Mempelai Pria"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-36">
                      <h4 className="text-3xl font-semibold text-pink-700">
                        {dataMempelai?.namaLengkapPria || "Putra"}
                      </h4>
                      <p className="text-gray-600 mt-2 italic text-sm">
                        Putra dari Bapak{" "}
                        {dataMempelai?.ayahMempelaiPria || "Ahmad"} & Ibu{" "}
                        {dataMempelai?.ibuMempelaiPria || "Siti"}
                      </p>

                      {/* Instagram */}
                      <a
                        href={
                          dataMempelai?.instagramMempelaiPria ||
                          "https://instagram.com/vidiofficial"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center mt-4 text-pink-600 hover:text-pink-800 transition-colors duration-300"
                      >
                        <Instagram size={22} strokeWidth={1.5} />
                        <span className="ml-2 text-sm font-medium">
                          Instagram
                        </span>
                      </a>
                    </div>

                    <div className="absolute top-0 right-0 bg-pink-200/30 w-20 h-20 rounded-bl-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 bg-pink-100/30 w-24 h-24 rounded-tr-full blur-2xl"></div>
                  </motion.div>

                  {/* Ornamen Tengah (& Symbol) */}
                  <motion.div
                    className="flex flex-col items-center justify-center relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <motion.div
                      className="absolute inset-0 blur-3xl bg-pink-200/40 w-44 h-44 rounded-full animate-pulse-slow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 2 }}
                    />
                    <motion.span
                      className="relative text-7xl text-pink-600 font-[var(--font-vibes)] z-10 drop-shadow-md"
                      initial={{ rotate: -15, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      &
                    </motion.span>
                  </motion.div>

                  {/* === Mempelai Wanita === */}
                  <motion.div
                    className="relative w-full md:w-[320px] mt-12 bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-6 text-center transform hover:-translate-y-2 transition-all duration-700 border border-pink-200/50"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full overflow-hidden ring-4 ring-pink-300 shadow-xl">
                      <img
                        src={
                          dataMempelai?.fotoMempelaiWanita ||
                          "/foto-dummy/wanita.png"
                        }
                        alt="Mempelai Wanita"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-36">
                      <h4 className="text-3xl font-semibold text-pink-700">
                        {dataMempelai?.namaLengkapWanita || "Putri"}
                      </h4>
                      <p className="text-gray-600 mt-2 italic text-sm">
                        Putri dari Bapak{" "}
                        {dataMempelai?.ayahMempelaiWanita || "Yusuf"} & Ibu
                        {dataMempelai?.ibuMempelaiWanita || "Laila"}
                      </p>

                      <a
                        href={
                          dataMempelai?.instagramMempelaiWanita ||
                          "https://instagram.com/riffany.official"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center mt-4 text-pink-600 hover:text-pink-800 transition-colors duration-300"
                      >
                        <Instagram size={22} strokeWidth={1.5} />
                        <span className="ml-2 text-sm font-medium">
                          Instagram
                        </span>
                      </a>
                    </div>

                    <div className="absolute top-0 right-0 bg-pink-200/30 w-20 h-20 rounded-bl-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 bg-pink-100/30 w-24 h-24 rounded-tr-full blur-2xl"></div>
                  </motion.div>
                </div>

                {/* ===== Waktu & Tempat ===== */}
                <motion.div
                  className="mt-24 text-center text-gray-700"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                >
                  <motion.p
                    className="mt-8 italic text-gray-500 max-w-xl mx-auto text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                  >
                    Merupakan kehormatan dan kebahagiaan bagi kami apabila
                    Bapak/Ibu berkenan hadir untuk memberikan doa restu.
                  </motion.p>
                </motion.div>
              </section>

              {/* Countdown Section - Tema Pink */}
              <section className="relative w-full mt-10 py-28 bg-gradient-to-b from-rose-50 via-white to-pink-50 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute inset-0">
                  <div className="absolute top-[-10%] left-[10%] w-80 h-80 bg-pink-200/40 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-[-10%] right-[5%] w-[28rem] h-[28rem] bg-rose-300/30 rounded-full blur-3xl animate-pulse" />
                </div>

                <div className="relative container mx-auto px-6 flex flex-col items-center justify-center text-center space-y-10">
                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-bold text-rose-700 drop-shadow-sm"
                  >
                    Hitungan Mundur Menuju Hari Bahagia 💕
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-rose-600 max-w-xl leading-relaxed"
                  >
                    Catat tanggalnya — mari rayakan cinta dan kebahagiaan kami
                    bersama orang-orang terkasih.
                  </motion.p>

                  {/* Countdown Boxes */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4"
                  >
                    {[
                      { label: "Hari", value: timeLeft.days },
                      { label: "Jam", value: timeLeft.hours },
                      { label: "Menit", value: timeLeft.minutes },
                      { label: "Detik", value: timeLeft.seconds },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.6 }}
                        className="flex flex-col items-center justify-center rounded-2xl bg-white/60 backdrop-blur-lg shadow-lg border border-rose-200/60 hover:scale-105 transition-transform duration-300 p-6"
                      >
                        <span className="text-4xl md:text-5xl font-bold text-rose-700 drop-shadow-sm">
                          {padNumber(item.value) || 0}
                        </span>
                        <span className="text-sm mt-2 tracking-wide text-rose-600 font-medium">
                          {item.label}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* When Countdown Finished */}
                  {finished && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                      className="mt-14 px-10 py-6 bg-rose-100/70 backdrop-blur-md rounded-3xl border border-rose-200 shadow-lg"
                    >
                      <h3 className="text-2xl md:text-3xl font-bold text-rose-700 mb-2">
                        Hari yang Ditunggu Telah Tiba! 🌸
                      </h3>
                      <p className="text-rose-600">
                        Terima kasih atas doa, cinta, dan kehadiran Anda di hari
                        bahagia kami 💗
                      </p>
                    </motion.div>
                  )}
                </div>
              </section>

              {/* Akad Nikah & Resepsi - Tema Pink */}
              <section
                id="kalender"
                className="relative w-full py-24 bg-gradient-to-b from-rose-50 via-pink-50 to-white overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute inset-0">
                  <div className="absolute top-[10%] left-[5%] w-80 h-80 bg-rose-200/30 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-[10%] right-[5%] w-[28rem] h-[28rem] bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
                </div>

                <div className="relative container mx-auto px-6 text-center">
                  {/* Judul */}
                  <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-bold text-rose-700 mb-4"
                  >
                    Akad Nikah & Resepsi
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-rose-600 mb-16 max-w-2xl mx-auto leading-relaxed"
                  >
                    Dengan penuh rasa syukur dan cinta, kami mengundang Anda
                    untuk hadir dan memberikan doa restu di hari bahagia kami.
                  </motion.p>

                  {/* Card Container */}
                  <div className="flex flex-col md:flex-row justify-center items-stretch gap-10">
                    {/* Akad Nikah Card */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="relative flex-1 bg-white/70 backdrop-blur-xl border border-rose-200 rounded-3xl shadow-xl p-10 flex flex-col items-center text-center hover:shadow-2xl transition"
                    >
                      {/* Ornamen Atas */}
                      <img
                        src="/asset/platinum/tema-travel/tema-love.png"
                        alt="floral"
                        className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 opacity-30"
                      />

                      <CalendarDays className="w-10 h-10 text-rose-600 mb-3" />
                      <h3 className="text-2xl font-semibold text-rose-700 mb-6">
                        Akad Nikah
                      </h3>

                      <div className="flex justify-center items-center gap-6 mb-6">
                        <div className="text-right text-rose-600">
                          <p className="text-xs tracking-wider font-medium">
                            MINGGU
                          </p>
                          <p className="text-xs text-rose-500">
                            09.00 - 10.00 WIB
                          </p>
                        </div>
                        <div className="bg-gradient-to-b from-rose-400 to-rose-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold shadow-md">
                          31
                        </div>
                        <div className="text-left text-rose-600">
                          <p className="text-xs tracking-wider font-medium">
                            AGUSTUS
                          </p>
                          <p className="text-xs text-rose-500">2025</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center mb-6">
                        <MapPin className="text-rose-600 mb-2" />
                        <h4 className="font-bold text-sm text-rose-700 uppercase">
                          Kediaman Mempelai Wanita
                        </h4>
                        <p className="text-xs text-rose-500 leading-relaxed mt-1 max-w-xs">
                          Jl. Guntur Melati Masuk ke Gapura MDL 525,
                          Haurpanggung, Kec. Tarogong Kidul, Kabupaten Garut,
                          Jawa Barat 44151
                        </p>
                      </div>

                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 bg-rose-600 text-white text-sm px-6 py-2 rounded-full shadow hover:bg-rose-700 transition"
                      >
                        📍 Buka Maps
                      </a>
                    </motion.div>

                    {/* Resepsi Card */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="relative flex-1 bg-white/70 backdrop-blur-xl border border-rose-200 rounded-3xl shadow-xl p-10 flex flex-col items-center text-center hover:shadow-2xl transition"
                    >
                      <img
                        src="/asset/platinum/tema-travel/tema-love.png"
                        alt="floral"
                        className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 opacity-30"
                      />

                      <CalendarDays className="w-10 h-10 text-rose-600 mb-3" />
                      <h3 className="text-2xl font-semibold text-rose-700 mb-6">
                        Resepsi
                      </h3>

                      <div className="flex justify-center items-center gap-6 mb-6">
                        <div className="text-right text-rose-600">
                          <p className="text-xs tracking-wider font-medium">
                            MINGGU
                          </p>
                          <p className="text-xs text-rose-500">
                            10.30 - 13.00 WIB
                          </p>
                        </div>
                        <div className="bg-gradient-to-b from-rose-400 to-rose-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold shadow-md">
                          31
                        </div>
                        <div className="text-left text-rose-600">
                          <p className="text-xs tracking-wider font-medium">
                            AGUSTUS
                          </p>
                          <p className="text-xs text-rose-500">2025</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center mb-6">
                        <MapPin className="text-rose-600 mb-2" />
                        <h4 className="font-bold text-sm text-rose-700 uppercase">
                          Kediaman Mempelai Wanita
                        </h4>
                        <p className="text-xs text-rose-500 leading-relaxed mt-1 max-w-xs">
                          Jl. Guntur Melati Masuk ke Gapura MDL 525,
                          Haurpanggung, Kec. Tarogong Kidul, Kabupaten Garut,
                          Jawa Barat 44151
                        </p>
                      </div>

                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 bg-rose-600 text-white text-sm px-6 py-2 rounded-full shadow hover:bg-rose-700 transition"
                      >
                        📍 Buka Maps
                      </a>
                    </motion.div>
                  </div>
                </div>

                {/* Ornamen Kelopak Jatuh */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-pink-200 rounded-full opacity-70 animate-fall"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 1.5}s`,
                        animationDuration: `${5 + Math.random() * 5}s`,
                      }}
                    ></div>
                  ))}
                </div>

                {/* Animasi Kelopak */}
                <style jsx>{`
                  @keyframes fall {
                    0% {
                      transform: translateY(-10%) rotate(0deg);
                      opacity: 0.8;
                    }
                    100% {
                      transform: translateY(110vh) rotate(360deg);
                      opacity: 0;
                    }
                  }
                  .animate-fall {
                    animation: fall linear infinite;
                  }
                `}</style>
              </section>

              {/* love story */}
              <motion.section
                id="love"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative mt-12 py-24 bg-gradient-to-b from-pink-200 via-pink-100 to-white overflow-hidden"
              >
                {/* Ornamen bunga pink transparan */}
                <div className="absolute left-0 top-0 w-44 h-44 bg-no-repeat bg-contain opacity-20 animate-pulse"></div>
                <div className="absolute right-0 bottom-0 w-44 h-44  bg-no-repeat bg-contain opacity-20 rotate-180 animate-pulse"></div>

                <h2 className="text-4xl font-extrabold text-pink-700 text-center mb-6 tracking-wide">
                  Our Love Story
                </h2>
                <p className="text-center text-pink-600 max-w-2xl mx-auto mb-5">
                  Cinta kami berawal dari pertemuan sederhana, tumbuh dalam doa,
                  dan kini berlabuh pada satu janji suci yang diridhai oleh-Nya
                  💕
                </p>

                {/* foto lovestory */}
                <motion.img
                  src={
                    dataMempelai?.fotoSampul[0] || "/foto-dummy/slider5.jpeg"
                  }
                  loading="lazy"
                  alt="Bunga Pembuka"
                  className=" w-[200px] mx-auto border-4 border-white mb-5 h-[200px] object-cover rounded-4xl"
                />

                {/* Timeline horizontal */}
                <div className="relative flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 px-6 md:px-20">
                  {/* Step 1 */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative bg-white/70 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-full md:w-1/3 border border-pink-200 hover:border-pink-400 transition"
                  >
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                      1
                    </div>
                    <h3 className="text-2xl font-semibold text-pink-700 mt-4">
                      Awal Pertemuan
                    </h3>
                    <p className="text-pink-700 mt-3">
                      {dataMempelai?.loveStory[0].text ||
                        `Tak ada yang kebetulan dalam rencana Tuhan. Di antara
                      banyak wajah, kami dipertemukan dengan cara yang tak
                      disangka. Satu senyum, satu sapaan, menjadi awal dari
                      kisah yang perlahan tumbuh menjadi cinta.`}
                    </p>
                    <p className="mt-4 text-sm text-pink-500 italic">
                      {dataMempelai?.loveStory[0].when || "2019"}
                    </p>
                  </motion.div>

                  {/* Step 2 */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative bg-white/70 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-full md:w-1/3 border border-pink-200 hover:border-pink-400 transition"
                  >
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                      2
                    </div>
                    <h3 className="text-2xl font-semibold text-pink-700 mt-4">
                      Tumbuh Dalam Doa
                    </h3>
                    <p className="text-pink-700 mt-3">
                      {dataMempelai?.loveStory[1].text ||
                        `Dalam perjalanan waktu, kami belajar tentang kesabaran dan
                      arti saling memahami. Kami berdoa di waktu yang sama,
                      meniti langkah bersama, hingga akhirnya yakin bahwa takdir
                      memang telah menulis nama kami berdampingan.`}
                    </p>
                    <p className="mt-4 text-sm text-pink-500 italic">
                      {dataMempelai?.loveStory[1].when || "2021"}
                    </p>
                  </motion.div>

                  {/* Step 3 */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative bg-white/70 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-full md:w-1/3 border border-pink-200 hover:border-pink-400 transition"
                  >
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                      3
                    </div>
                    <h3 className="text-2xl font-semibold text-pink-700 mt-4">
                      Menuju Satu Ikatan
                    </h3>
                    <p className="text-pink-700 mt-3">
                      {dataMempelai?.loveStory[2].text ||
                        `Di bawah cahaya cinta dan restu keluarga, kami
                      mengikrarkan janji untuk berjalan seirama menuju kehidupan
                      baru. Cinta kami kini bukan hanya tentang dua hati, tapi
                      satu takdir yang menyatu selamanya.`}
                    </p>
                    <p className="mt-4 text-sm text-pink-500 italic">
                      {dataMempelai?.loveStory[2].when || "2025"}
                    </p>
                  </motion.div>
                </div>

                {/* Divider */}
                <div className="mt-20 text-center">
                  <div className="w-32 h-1 bg-pink-400 mx-auto rounded-full"></div>
                  <p className="text-pink-600 mt-3 italic">
                    “Cinta sejati bukan sekadar memiliki, tapi menyatu dalam doa
                    dan restu Ilahi.”
                  </p>
                </div>
              </motion.section>

              {/* Galeri Foto */}
              <motion.section
                id="galeri"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative py-24 mt-12 bg-gradient-to-b from-pink-100 via-pink-50 to-white overflow-hidden"
              >
                {/* Ornamen bunga lembut */}
                <div className="absolute left-0 top-0 w-44 h-44 bg-[url('/asset/platinum/tema-bunga/bunga-pink.png')] bg-no-repeat bg-contain opacity-20 animate-pulse"></div>
                <div className="absolute right-0 bottom-0 w-44 h-44 bg-[url('/asset/platinum/tema-bunga/bunga-pink.png')] bg-no-repeat bg-contain opacity-20 rotate-180 animate-pulse"></div>

                {/* Judul */}
                <div className="text-center mb-16 px-4">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-pink-700 tracking-tight mb-4">
                    Galeri Cinta Kami
                  </h2>
                  <p className="text-pink-600 max-w-2xl mx-auto">
                    Setiap momen berharga terekam dalam bingkai kenangan indah.
                    Inilah potret perjalanan cinta kami menuju hari bahagia 💕
                  </p>
                </div>

                {/* Slider Foto Utama */}
                <div className="relative w-full max-w-5xl mx-auto mb-16 overflow-hidden rounded-3xl shadow-2xl">
                  <motion.div
                    className="flex"
                    animate={{
                      x: ["0%", "-100%", "-200%", "0%"],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 15,
                      ease: "linear",
                    }}
                  >
                    {[
                      dataMempelai?.gallery[0] || "/foto-dummy/slider1.avif",
                      dataMempelai?.gallery[1] || "/foto-dummy/slider2.jpeg",
                      dataMempelai?.gallery[2] || "/foto-dummy/slider3.avif",
                      dataMempelai?.gallery[3] || "/foto-dummy/slider4.jpg",
                    ].map((src, i) => (
                      <div key={i} className="w-full flex-shrink-0">
                        <img
                          src={src}
                          alt={`Slider ${i + 1}`}
                          className="w-full h-[400px] md:h-[500px] object-cover"
                        />
                      </div>
                    ))}
                  </motion.div>

                  {/* Overlay gradasi lembut */}
                  <div className="absolute inset-0 bg-gradient-to-b from-pink-100/20 via-transparent to-pink-200/30"></div>
                </div>

                {/* Galeri Grid */}
                <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {dataMempelai?.gallery.length > 0
                    ? dataMempelai?.gallery.map((src, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                          onClick={() => setSelectedImage(src)}
                        >
                          <img
                            src={src}
                            alt={`Foto ${i + 1}`}
                            className="object-cover w-full h-52 md:h-64 lg:h-72 transform group-hover:scale-110 transition duration-500"
                          />
                          {/* Overlay hover */}
                          <div className="absolute inset-0 bg-pink-500/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-500">
                            <span className="text-white text-sm md:text-base font-medium tracking-wide">
                              Klik untuk melihat 💖
                            </span>
                          </div>
                        </motion.div>
                      ))
                    : [
                        "/images/prewed-1.jpg",
                        "/images/prewed-2.jpg",
                        "/images/tmp.jpg",
                        "/images/bg-wedding.jpg",
                        "/images/bg.jpg",
                      ].map((src, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                          onClick={() => setSelectedImage(src)}
                        >
                          <img
                            src={src}
                            alt={`Foto ${i + 1}`}
                            className="object-cover w-full h-52 md:h-64 lg:h-72 transform group-hover:scale-110 transition duration-500"
                          />
                          {/* Overlay hover */}
                          <div className="absolute inset-0 bg-pink-500/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-500">
                            <span className="text-white text-sm md:text-base font-medium tracking-wide">
                              Klik untuk melihat 💖
                            </span>
                          </div>
                        </motion.div>
                      ))}
                </div>

                {/* Lightbox Modal */}
                {selectedImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-pink-200/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                  >
                    <motion.img
                      src={selectedImage}
                      alt="Foto Besar"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="rounded-2xl max-h-[85vh] max-w-[90vw] object-contain shadow-2xl border-4 border-pink-300"
                    />
                    {/* Tombol close */}
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-8 right-8 text-pink-700 text-3xl hover:text-pink-500 transition"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}
              </motion.section>

              {/* Wedding Gift Section */}
              <motion.section
                className="relative mt-16 py-24 bg-gradient-to-b from-pink-50 via-pink-100/50 to-white text-center overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                {/* Ornamen Background */}
                <img
                  src="/asset/platinum/tema-travel/ornament-bunga.png"
                  className="absolute left-0 top-0 w-48 opacity-30 -rotate-12 pointer-events-none animate-pulse"
                  alt="ornamen bunga"
                />
                <img
                  src="/asset/platinum/tema-travel/ornament-bungat.png"
                  className="absolute right-0 bottom-0 w-48 opacity-30 rotate-12 pointer-events-none animate-pulse"
                  alt="ornamen bunga"
                />

                {/* Judul */}
                <motion.h2
                  className="text-4xl md:text-5xl font-bold text-pink-700 mb-4 font-playfair tracking-wide drop-shadow-sm"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Wedding Gift 💝
                </motion.h2>

                <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed mb-10 px-6">
                  Doa dan restu Anda sudah merupakan hadiah terindah bagi kami.
                  Namun apabila ingin memberikan tanda kasih, dengan penuh
                  syukur kami menerimanya melalui rekening berikut:
                </p>

                {/* Tombol buka hadiah */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGift((prev) => !prev)}
                  className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-full shadow-lg hover:bg-pink-700 transition duration-300"
                >
                  {showGift ? "Tutup Hadiah 🎀" : "Buka Hadiah Pernikahan 🎁"}
                </motion.button>

                {/* Card Gift */}
                <AnimatePresence>
                  {showGift && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      transition={{ duration: 0.6 }}
                      className="mt-12 flex justify-center flex-wrap gap-8 px-6"
                    >
                      {dataMempelai?.rekening.length > 0
                        ? dataMempelai?.rekening.map((rek, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.03 }}
                              className="relative bg-white rounded-3xl shadow-2xl w-80 p-8 border border-pink-100 hover:border-pink-300 transition"
                            >
                              {/* Ornamen lembut */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-pink-50 via-white to-pink-100 opacity-40 rounded-3xl"></div>

                              <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-5">
                                  <h3 className="text-xl font-bold text-pink-700">
                                    Bank {rek.bank}
                                  </h3>
                                </div>

                                <p className="text-gray-700 mb-1">
                                  No. Rekening:
                                  <span className="font-semibold ml-2 text-gray-900">
                                    {rek.nomor}
                                  </span>
                                </p>
                                <p className="text-gray-700 mb-5">
                                  a.n.{" "}
                                  <span className="font-semibold text-gray-900">
                                    {rek.nama}
                                  </span>
                                </p>

                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(rek.nomor);
                                    setCopied(rek.nomor);
                                    setTimeout(() => setCopied(null), 2000);
                                  }}
                                  className="text-sm bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-pink-700 transition"
                                >
                                  {copied === rek.nomor
                                    ? "✅ Disalin"
                                    : "Salin Nomor"}
                                </button>
                              </div>
                            </motion.div>
                          ))
                        : rekeningList.map((rek) => (
                            <motion.div
                              key={rek.id}
                              whileHover={{ scale: 1.03 }}
                              className="relative bg-white rounded-3xl shadow-2xl w-80 p-8 border border-pink-100 hover:border-pink-300 transition"
                            >
                              {/* Ornamen lembut */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-pink-50 via-white to-pink-100 opacity-40 rounded-3xl"></div>

                              <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-5">
                                  <img
                                    src={rek.logo}
                                    alt={rek.bank}
                                    className="w-10 h-10"
                                  />
                                  <h3 className="text-xl font-bold text-pink-700">
                                    Bank {rek.bank}
                                  </h3>
                                </div>

                                <p className="text-gray-700 mb-1">
                                  No. Rekening:
                                  <span className="font-semibold ml-2 text-gray-900">
                                    {rek.nomor}
                                  </span>
                                </p>
                                <p className="text-gray-700 mb-5">
                                  a.n.{" "}
                                  <span className="font-semibold text-gray-900">
                                    {rek.nama}
                                  </span>
                                </p>

                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(rek.nomor);
                                    setCopied(rek.id.toString());
                                    setTimeout(() => setCopied(null), 2000);
                                  }}
                                  className="text-sm bg-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-pink-700 transition"
                                >
                                  {copied === rek.id.toString()
                                    ? "✅ Disalin"
                                    : "Salin Nomor"}
                                </button>
                              </div>
                            </motion.div>
                          ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hiasan bawah */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-pink-100 to-transparent pointer-events-none"></div>
              </motion.section>

              {/* Form RSVP */}
              <motion.form
                id="rsvp"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative py-24 mt-16 rounded-3xl bg-gradient-to-b from-pink-50 via-white to-pink-50 text-center overflow-hidden"
              >
                {/* Ornamen background */}
                <img
                  src="/asset/platinum/tema-travel/ornament-love.png"
                  alt="ornamen bunga"
                  className="absolute left-0 top-0 w-48 opacity-25 -rotate-12 pointer-events-none animate-pulse"
                />
                <img
                  src="/asset/platinum/tema-travel/ornament-love.png"
                  alt="ornamen bunga"
                  className="absolute right-0 bottom-0 w-48 opacity-25 rotate-12 pointer-events-none animate-pulse"
                />

                {/* Judul */}
                <motion.h2
                  className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-4 font-playfair tracking-wide"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  RSVP Kehadiran 💌
                </motion.h2>

                <p className="text-gray-700 max-w-xl mx-auto mb-10 px-6">
                  Kami akan sangat berbahagia jika Anda dapat hadir dan berbagi
                  kebahagiaan di hari spesial kami. Mohon konfirmasi kehadiran
                  Anda melalui form di bawah ini ✨
                </p>

                {/* Form Container */}
                <motion.div
                  className="bg-white/95 shadow-2xl backdrop-blur-sm rounded-3xl p-8 md:p-10 w-[90%] max-w-xl mx-auto border border-pink-100"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex flex-col gap-6 text-left">
                    {/* Nama */}
                    <div>
                      <label className="block text-pink-700 font-semibold mb-2">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        placeholder="Masukkan nama Anda"
                        required
                        className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>

                    {/* Kehadiran */}
                    <div>
                      <label className="block text-pink-700 font-semibold mb-2">
                        Apakah Anda akan hadir?
                      </label>
                      <select
                        name="kehadiran"
                        value={formData.kehadiran}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                      >
                        <option value="">Pilih status kehadiran</option>
                        <option value="hadir">Ya, saya akan hadir 💖</option>
                        <option value="tidak hadir">
                          Maaf, saya tidak bisa hadir 🙏
                        </option>
                      </select>
                    </div>

                    {/* Ucapan */}
                    <div>
                      <label className="block text-pink-700 font-semibold mb-2">
                        Ucapan & Doa
                      </label>
                      <textarea
                        name="ucapan"
                        value={formData.ucapan}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tuliskan doa dan ucapan untuk kedua mempelai..."
                        className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                      ></textarea>
                    </div>

                    {/* Tombol Kirim */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="mt-4 bg-pink-600 text-white px-8 py-3 rounded-full shadow-md hover:bg-pink-700 transition font-semibold"
                    >
                      Kirim Konfirmasi 💌
                    </motion.button>
                  </div>

                  {/* Notifikasi */}
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 text-pink-700 bg-pink-100 py-3 rounded-xl font-medium"
                    >
                      🎉 Terima kasih atas konfirmasinya! Doa & kehadiran Anda
                      sangat berarti 💕
                    </motion.div>
                  )}
                </motion.div>

                {/* Ornamen bawah */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-pink-100 to-transparent pointer-events-none"></div>
              </motion.form>

              {/* Daftar Hadir & Ucapan Peserta */}
              <motion.section
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative py-24 mt-16 rounded-3xl bg-gradient-to-b from-pink-50 via-white to-pink-50 text-center overflow-hidden"
              >
                {/* Background dekorasi */}
                <div className="absolute inset-0">
                  <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
                </div>

                {/* Judul */}
                <motion.h2
                  className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-4 font-playfair tracking-wide"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Daftar Kehadiran & Ucapan 💕
                </motion.h2>

                <p className="text-gray-700 max-w-xl mx-auto mb-12 px-4">
                  Terima kasih atas doa, cinta, dan kehadiran dari sahabat &
                  keluarga tercinta ✨
                </p>

                {/* Statistik Kehadiran */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16"
                >
                  <div className="bg-white/90 shadow-lg rounded-3xl px-10 py-6 w-64 border border-pink-100 backdrop-blur-md hover:shadow-pink-200 transition">
                    <h3 className="text-4xl font-bold text-pink-700">
                      {totalHadir}
                    </h3>
                    <p className="text-gray-600 mt-1 font-medium">
                      Tamu Hadir 💖
                    </p>
                  </div>
                  <div className="bg-white/90 shadow-lg rounded-3xl px-10 py-6 w-64 border border-pink-100 backdrop-blur-md hover:shadow-rose-200 transition">
                    <h3 className="text-4xl font-bold text-rose-600">
                      {totalTidakHadir}
                    </h3>
                    <p className="text-gray-600 mt-1 font-medium">
                      Tidak Hadir 💔
                    </p>
                  </div>
                </motion.div>

                {/* Daftar Ucapan */}
                <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    transition={{ staggerChildren: 0.15 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-6"
                  >
                    {data.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/90 backdrop-blur-sm shadow-md rounded-3xl p-6 border border-pink-100 text-left relative hover:shadow-lg transition-all"
                      >
                        {/* Ornamen bunga kecil */}
                        <div className="absolute top-4 right-4 w-6 h-6 bg-contain bg-no-repeat opacity-40"></div>

                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-pink-800">
                            {item.nama}
                          </h4>
                          <span
                            className={`text-sm font-medium px-3 py-1 rounded-full ${
                              item.kehadiran === "hadir"
                                ? "bg-pink-100 text-pink-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {item.kehadiran === "hadir"
                              ? "Hadir"
                              : "Tidak Hadir"}
                          </span>
                        </div>

                        <p className="text-gray-700 italic mb-3 leading-relaxed">
                          “{item.ucapan}”
                        </p>

                        <p className="text-xs text-gray-500 text-right">
                          {item.waktu}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Efek bawah */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-pink-100 to-transparent"></div>
              </motion.section>

              {/* Penutup */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="relative py-24 mt-16 bg-gradient-to-b from-pink-50 via-white to-pink-100 overflow-hidden text-center"
              >
                {/* foto penutup */}
                <motion.img
                  src={dataMempelai?.fotoSampul[0] || "/images/bg.jpg"}
                  loading="lazy"
                  alt="Bunga Pembuka"
                  className=" w-[200px] mx-auto border-4 border-[#a38751]  h-[270px] object-cover rounded-4xl"
                />

                {/* Ucapan Terima Kasih */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="relative z-10 container mt-12 mx-auto px-6 max-w-2xl"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-pink-500 mb-6 font-playfair">
                    Terima Kasih
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                    Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa
                    restu kepada kami.
                  </p>

                  <p className="text-pink-600 italic mb-10 bg-pink-50/60 py-4 px-6 rounded-xl border border-pink-100 shadow-sm">
                    "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
                    menciptakan pasangan-pasangan untukmu dari jenismu sendiri,
                    agar kamu cenderung dan merasa tenteram kepadanya, dan Dia
                    menjadikan di antaramu rasa kasih dan sayang." <br />
                    <span className="text-sm text-pink-400">
                      (QS. Ar-Rum: 21)
                    </span>
                  </p>

                  {/* Nama Pasangan */}
                  <div className="flex flex-col items-center space-y-4">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-800 font-playfair tracking-wide">
                      {dataMempelai?.panggilanPria || "Putra"}{" "}
                      <span className="text-pink-400">&</span>{" "}
                      {dataMempelai?.panggilanWanita || "Putri"}
                    </h3>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{
                        duration: 1.2,
                        ease: "easeOut",
                        delay: 0.3,
                      }}
                      className="w-20 h-0.5 bg-pink-400 rounded-full shadow-md"
                    />
                    <p className="text-gray-500 text-lg">
                      {dataMempelai?.tanggalAkad || "21 Desember 2025"}
                    </p>
                  </div>
                </motion.div>

                {/* Footer */}
                <footer className="mt-16 text-sm text-pink-400">
                  <p>
                    Dibuat dengan 💖 oleh{" "}
                    <span className="text-pink-500 font-semibold">
                      Our Journey
                    </span>
                  </p>
                </footer>
              </motion.section>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

function getTimeRemaining(target) {
  const now = new Date();
  const t = Math.max(0, target.getTime() - now.getTime()); // ms remaining, at least 0
  // compute step-by-step:
  const msInSecond = 1000;
  const msInMinute = 60 * msInSecond;
  const msInHour = 60 * msInMinute;
  const msInDay = 24 * msInHour;

  const days = Math.floor(t / msInDay);
  const hours = Math.floor((t % msInDay) / msInHour);
  const minutes = Math.floor((t % msInHour) / msInMinute);
  const seconds = Math.floor((t % msInMinute) / msInSecond);

  return { total: t, days, hours, minutes, seconds };
}

function padNumber(n) {
  return String(n).padStart(2, "0");
}
