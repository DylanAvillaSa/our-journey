"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { CalendarDays } from "lucide-react";
import { PlayCircle, PauseCircle, Heart, Mail, Flower2 } from "lucide-react";
import AmplopGift from "@/components/paket/gold/AmplopGift";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/libs/config";
import Image from "next/image";
import TheDate from "@/components/paket/gold/CountdownVersi2";
import Parallax from "@/components/animation/Parallax";
import Gallery4 from "@/components/paket/gold/GallerySectionVersi4";
import { useSearchParams } from "next/navigation";
import { parseDate, formatTime } from "@/config/formatDate";

// ===== Dummy Messages (Ucapan & Doa) =====
const initialMessages = [
  {
    name: "Team Our Journey",
    time: "2025-08-09 16:17:53",
    message: "Semoga acaranya berjalan dengan lancar dan sesuai rencana 🙏",
  },
  {
    name: "Budi Santoso",
    time: "2025-08-09 17:45:10",
    message: "Selamat menempuh hidup baru, semoga bahagia selalu ❤️",
  },
];

// ===== Variasi Warna (2 Tema Baru, tanpa Emerald) =====
export const THEMES = {
  elegant: {
    pageBg:
      "bg-[radial-gradient(1400px_900px_at_30%_-20%,#f9f9f9,transparent),radial-gradient(1400px_900px_at_90%_0%,#fdfdfd,transparent)] bg-[#ffffff]",
    headerGrad: "bg-gradient-to-r from-gray-900 via-gray-800 to-black",
    card: "bg-gradient-to-br from-[#ffffff]/90 via-[#f5f5f5]/80 to-[#fafafa]/90 backdrop-blur-lg",
    border: "border-gray-400",
    textMain: "text-gray-900",
    cta: "bg-gradient-to-r from-gray-800 via-gray-700 to-black hover:from-black hover:to-gray-800",
    chip: "bg-gray-200 text-gray-900",
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

const containerVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
      ease: "easeOut",
    },
  },
  exit: { opacity: 0, y: 20, scale: 0.8, transition: { duration: 0.3 } },
};

// Variants untuk tiap tombol
const itemVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.5, y: 10 },
};

export default function Template6Gold({ id, data }) {
  const rsvpRef = useRef(null);
  const audioRef = useRef(null);
  const Ref = useRef(null);
  const searchParams = useSearchParams();
  const namaTamu = searchParams.get("to");
  const [switcher, setSwitcher] = useState(false);
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [theme, setTheme] = useState("elegant");

  const [formData, setFormData] = useState({
    nama: "",
    kehadiran: "",
  });

  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("msgs_v1");
      return raw ? JSON.parse(raw) : initialMessages;
    } catch (e) {
      return initialMessages;
    }
  });
  const [dataMempelai, setDataMempelai] = useState(data || null);

  const resepsi = parseDate(dataMempelai?.tanggalResepsi);
  const akad = parseDate(dataMempelai?.tanggalAkad);
  const jamAkad = formatTime(dataMempelai?.jamAkad);
  const jamResepsi = formatTime(dataMempelai?.jamResepsi);

  const [guestForm, setGuestForm] = useState({ name: "", message: "" });
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/gallery/p1.jpg",
    "/gallery/p2.jpg",
    "/gallery/p3.jpg",
    "/gallery/p4.jpg",
  ];
  const T = THEMES[theme];
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.2]);
  const ref = useRef(null);
  const [target, setTarget] = useState(null);
  const [guestBook, setGuestBook] = useState([]);

  const { scrollYProgress } = useScroll(
    ref.current ? { target: ref, offset: ["start end", "end start"] } : {}
  );
  useEffect(() => {
    if (ref.current) setTarget(ref.current);
  }, []);

  // mengambil data di database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ambil data berdasarkan email atau template
        const q = query(
          collection(db, "pembelian"),
          where("template", "==", "Gold 6"),
          where("status_pembayaran", "==", "lunas")
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty && id !== undefined) {
          const doc = querySnapshot.docs[0].data();
          setDataMempelai(doc.dataMempelai);
          setTheme(doc.dataMempelai.temaWarna);
        } else {
          console.log("❌ Tidak ada data ditemukan untuk template ini");
        }
      } catch (err) {
        console.error("Gagal ambil data Firestore:", err);
      }
    };

    fetchData();
  }, []);

  const handleOpen = () => setOpened(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1));
    }, 4000); // ganti slide tiap 4 detik
    return () => clearInterval(timer);
  }, [slides.length]);

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
    alert("Konfirmasi kehadiran terkirim ✅");
    setFormData({ nama: "", kehadiran: "" });
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
      `${dataMempelai?.panggilanPria || "Putra"} & ${
        dataMempelai?.panggilanWanita || "Putri"
      } Wedding`
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      "Acara pernikahan kami"
    )}&location=${encodeURIComponent("Masjid Al-Falah, Jakarta Selatan")}`;

    window.open(url, "_blank");
  };

  const images = dataMempelai?.gallery || [
    "/images/tmp.jpg",
    "/images/prewed-1.jpg",
    "/images/wedding-3.jpg",
  ]; // ganti sesuai foto pasangan lu

  const [current, setCurrent] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const images2 = ["/images/tmp.jpg", "/images/bg-wedding.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images2.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images2.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // ganti gambar tiap 5 detik
    return () => clearInterval(timer);
  }, [images.length]);

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
          {isPlaying ? <PauseCircle size={22} /> : <PlayCircle size={22} />}
          {/* Tooltip */}
          <span className="absolute right-full mr-2 px-2 py-1 text-xs bg-black/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            {isPlaying ? "Pause Music" : "Play Music"}
          </span>
        </motion.button>
      </div>

      {/* ===== Switcher (tengah bawah) ===== */}
      {!dataMempelai?.temaWarna && (
        <div className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2">
          <div
            className={`p-3 rounded-full shadow-lg text-xs ${T.cta} 
      text-white flex items-center justify-center ${
        switcher ? "hidden" : "opacity-35"
      } group`}
            onClick={() => setSwitcher(!switcher)}
          >
            Theme
          </div>
        </div>
      )}

      <AnimatePresence>
        {switcher && (
          <motion.div
            key="theme-switcher"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex gap-2 items-end fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
          >
            {Object.entries(THEMES).map(([key, val]) => (
              <motion.button
                key={key}
                variants={itemVariants}
                whileHover={{ scale: 1.15, rotate: 6 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  setTheme(key);
                  setSwitcher(false);
                }}
                className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center relative group transition-all 
                  ${val.chip}
                  ${
                    theme === key ? "ring-2 ring-offset-2 ring-yellow-500" : ""
                  }`}
                style={{
                  // warna utama
                  border: `2px solid ${val.borderColor || "#fff"}`, // optional: border dari theme
                }}
                aria-label={`Tema ${val.name}`}
              >
                {/* Tooltip */}
                <span className="absolute -top-7 px-2 py-1 text-xs bg-black/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {val.name}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Screen */}
      {!opened && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
        >
          {/* Background */}
          <Image
            src={dataMempelai?.gallery[0] || "/images/bg-wedding.jpg"} // ganti sama foto pasangan lu
            alt="Pasangan"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />

          {/* Konten */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 max-w-md w-full px-6"
          >
            {/* The Wedding Of */}
            <p className="text-white text-sm md:text-base tracking-[4px] uppercase mb-3 font-[var(--font-serif)]">
              THE WEDDING OF
            </p>

            {/* Nama pasangan */}
            <h1 className="font-[var(--font-vibes)] text-5xl md:text-6xl text-white mb-8">
              {dataMempelai?.panggilanPria || "Putra"} &{" "}
              {dataMempelai?.panggilanWanita || "Putri"}
            </h1>

            {/* Sapaan tamu */}
            <div className="mt-60">
              <p className="text-white text-sm md:text-base mb-1">
                Kepada Yth:
              </p>
              <p className="text-xl md:text-2xl font-semibold text-white mb-1">
                {namaTamu || "Nama Tamu"}
              </p>
              <p className="text-white text-sm md:text-base mb-6">Di Tempat</p>
            </div>

            {/* Tombol */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="border border-white bg-white text-slate-800 px-6 py-3 rounded-lg font-medium tracking-wide flex items-center gap-2 mx-auto"
            >
              <Mail className="w-5 h-5" /> Buka Undangan
            </motion.button>
          </motion.div>
        </motion.section>
      )}

      {/* ===== UNDANGAN LENGKAP ===== */}
      {opened && (
        <div className="relative z-10 pb-24">
          <div className="w-full">
            <Parallax
              currentImage={currentImage}
              images={images}
              datamempelai={dataMempelai}
            />

            {/* Section We Found Love */}
            <motion.section
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative py-16 px-6 text-center rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src={dataMempelai?.gallery[1] || "/images/prewed-1.jpg"} // ganti dengan gambar lo
                  alt="Background Love"
                  className="w-full h-full object-cover"
                />
                {/* Overlay transparan */}
                <div className="absolute inset-0 bg-white/80 " />
              </div>

              {/* Konten */}
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="flex justify-center mb-6 relative"
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#b23a48]/10 border border-[#b23a48]/30 shadow-md">
                    <Flower2 className="w-8 h-8 text-[#b23a48]" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  viewport={{ once: true }}
                  className="text-xl font-semibold text-gray-800 mb-6"
                >
                  We Found Love
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  viewport={{ once: true }}
                  className="text-gray-700 max-w-2xl mx-auto leading-relaxed italic"
                >
                  “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
                  menciptakan pasangan-pasangan untukmu dari jenismu sendiri,
                  agar kamu cenderung dan merasa tenteram kepadanya, dan Dia
                  menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada
                  yang demikian itu benar-benar terdapat tanda-tanda (kebesaran
                  Allah) bagi kaum yang berpikir.”
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  viewport={{ once: true }}
                  className="mt-4 font-semibold text-sm tracking-wide text-gray-600"
                >
                  ( QS. Ar-Rum 21 )
                </motion.p>
              </div>
            </motion.section>
          </div>

          {/* Profile Mempelai */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative py-20 px-6 overflow-hidden"
          >
            {/* Background Layer */}
            <div className="absolute inset-0">
              {/* Overlay transparan biar teks kebaca */}
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
            </div>

            {/* Judul Section */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative text-center mb-16 z-10"
            >
              <h2
                className={`font-[var(--font-playfair)] text-3xl md:text-5xl ${THEMES[theme].textMain} mb-4 tracking-wide relative inline-block`}
              >
                <span
                  className={`px-6 py-2 border-y-2 border-[var(--color-primary)] ${THEMES[theme].textMain}`}
                >
                  Profil Mempelai
                </span>
              </h2>
              <p
                className={`${THEMES[theme].textMain} text-sm md:text-base mt-4`}
              >
                Dengan memohon rahmat dan ridho Allah SWT, perkenankanlah kami
                mempersembahkan kisah bahagia ini
              </p>
            </motion.div>

            {/* Grid Profile */}
            <div className="relative grid md:grid-cols-2 gap-12 max-w-5xl mx-auto z-10">
              {/* Mempelai Wanita */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="relative flex flex-col items-center text-center bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-pink-200"
              >
                <div className="relative w-40 h-40 md:w-52 md:h-52 mb-6">
                  <Image
                    src={
                      dataMempelai?.fotoMempelaiWanita[0] ||
                      "/foto-dummy/wanita.png"
                    }
                    alt="Mempelai Wanita"
                    fill
                    className="rounded-full object-cover border-4 border-[var(--color-primary)] shadow-lg"
                  />
                </div>
                <h3 className="font-[var(--font-vibes)] text-3xl text-gray-800">
                  {dataMempelai?.namaLengkapWanita || "Putri Anjani"}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  Putri dari Bapak {dataMempelai?.ayahMempelaiWanita || "Ahmad"}{" "}
                  & Ibu {dataMempelai?.ibuMempelaiWanita || "Siti"}
                </p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-md">
                  Seorang wanita penyayang, penuh perhatian, dan selalu ceria
                  yang kini siap melangkah menuju babak baru kehidupannya.
                </p>
              </motion.div>

              {/* Mempelai Pria */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="relative flex flex-col items-center text-center bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-blue-200"
              >
                <div className="relative w-40 h-40 md:w-52 md:h-52 mb-6">
                  <Image
                    src={
                      dataMempelai?.fotoMempelaiPria[0] ||
                      "/foto-dummy/pria.png"
                    }
                    alt="Mempelai Pria"
                    fill
                    className="rounded-full object-cover border-4 border-[var(--color-primary)] shadow-lg"
                  />
                </div>
                <h3 className="font-[var(--font-vibes)] text-3xl text-gray-800">
                  {dataMempelai?.namaLengkapPria || "Putra Perkasa"}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  Putra dari Bapak {dataMempelai?.ayahMempelaiPria || "Yusuf"} &
                  Ibu {dataMempelai?.ibuMempelaiPria || "Aminah"}
                </p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-md">
                  Seorang pria sederhana, penuh tanggung jawab, dan sabar yang
                  telah menemukan belahan jiwanya.
                </p>
              </motion.div>
            </div>

            {/* Ornamen Dekorasi Parallax */}
            <motion.img
              src="/asset/florar.png"
              alt="ornamen kiri"
              className="absolute top-10 left-0 w-28 md:w-48 opacity-50 pointer-events-none"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            />
            <motion.img
              src="/asset/florar.png"
              alt="ornamen kanan"
              className="absolute bottom-10 right-0 w-32 md:w-48 opacity-50 pointer-events-none"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true }}
            />
          </motion.section>

          {/* Love Story Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="py-20 px-6 relative max-w-5xl mx-auto"
          >
            {/* Judul Section */}
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className={`text-3xl md:text-5xl font-[var(--font-vibes)] text-center mb-14 text-transparent bg-clip-text ${THEMES[theme].headerGrad}`}
            >
              Our Love Story
            </motion.h2>

            {/* Timeline Wrapper */}
            <div className="relative">
              {/* Garis Tengah */}
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b ${THEMES[theme].border} via-gray-200 ${THEMES[theme].chip} rounded-full`}
              ></div>

              {/* Items */}

              {dataMempelai?.loveStory.length > 0
                ? dataMempelai?.loveStory.map((item, idx) => (
                    <motion.div
                      key={idx}
                      className={`mb-16 flex items-center w-full ${
                        idx % 2 === 0 ? "justify-start" : "justify-end"
                      }`}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -80 : 80 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                        delay: idx * 0.2,
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      {/* Card */}
                      <div
                        className={`relative w-full md:w-[45%] bg-white rounded-2xl shadow-xl border border-pink-100 p-6 flex flex-col items-center text-center`}
                      >
                        {/* Foto Pasangan */}
                        <div className="relative w-28 h-28 mb-4 rounded-full overflow-hidden shadow-md border-4 border-pink-200">
                          <img
                            src={dataMempelai?.gallery[idx]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Icon Dot */}
                        <div
                          className={`absolute top-6 ${
                            idx % 2 === 0 ? "-right-8" : "-left-8"
                          } w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                            THEMES[theme].cta
                          }`}
                        >
                          <i className="fa-solid fa-heart text-white"></i>
                        </div>

                        {/* Isi Card */}
                        <p className="text-sm text-gray-400">{item.year}</p>
                        <h3
                          className={`text-xl font-semibold mb-2 ${THEMES[theme].textMain}`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base">
                          {item.text}
                        </p>
                      </div>
                    </motion.div>
                  ))
                : [
                    {
                      when: "2019",
                      title: "First Met",
                      text: "Kami pertama kali bertemu di kampus dan langsung merasa ada sesuatu yang berbeda.",
                      img: dataMempelai?.gallery[0] || "/images/prewed-1.jpg",
                    },
                    {
                      when: "2020",
                      title: "First Date",
                      text: "Momen pertama kali jalan bersama menjadi kenangan yang tak terlupakan.",
                      img: dataMempelai?.gallery[1] || "/images/prewed-1.jpg",
                    },
                    {
                      when: "2022",
                      title: "Engagement",
                      text: "Kami memutuskan untuk mengikat janji dalam sebuah pertunangan sederhana.",
                      img: dataMempelai?.gallery[2] || "/images/wedding-2.jpg",
                    },
                    {
                      when: "2025",
                      title: "Wedding Day",
                      text: "Hari spesial di mana kami berjanji sehidup semati.",
                      img: dataMempelai?.gallery[3] || "/images/bg.jpg",
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className={`mb-16 flex items-center w-full ${
                        idx % 2 === 0 ? "justify-start" : "justify-end"
                      }`}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -80 : 80 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                        delay: idx * 0.2,
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      {/* Card */}
                      <div
                        className={`relative w-full md:w-[45%] bg-white rounded-2xl shadow-xl border border-pink-100 p-6 flex flex-col items-center text-center`}
                      >
                        {/* Foto Pasangan */}
                        <div className="relative w-28 h-28 mb-4 rounded-full overflow-hidden shadow-md border-4 border-pink-200">
                          <img
                            src={item.img}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Icon Dot */}
                        <div
                          className={`absolute top-6 ${
                            idx % 2 === 0 ? "-right-8" : "-left-8"
                          } w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                            THEMES[theme].cta
                          }`}
                        >
                          <i className="fa-solid fa-heart text-white"></i>
                        </div>

                        {/* Isi Card */}
                        <p className="text-sm text-gray-400">{item.year}</p>
                        <h3
                          className={`text-xl font-semibold mb-2 ${THEMES[theme].textMain}`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base">
                          {item.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
            </div>

            {/* Ornamen Dekorasi */}
            <motion.img
              src="/asset/florar.png"
              alt="ornamen kiri"
              className="absolute top-0 left-0 w-28 md:w-40 opacity-50 pointer-events-none"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            />
            <motion.img
              src="/asset/florar.png"
              alt="ornamen kanan"
              className="absolute bottom-0 right-0 w-28 md:w-40 opacity-50 pointer-events-none"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true }}
            />
          </motion.section>

          {/* Countdown & Acara */}
          <section className="relative py-16 px-6 max-w-4xl mx-auto">
            <TheDate
              background={THEMES}
              theme={theme}
              datamempelai={dataMempelai}
            />

            {/* Grid Card */}
            <div className="grid md:grid-cols-2 gap-8 mt-10">
              {[
                {
                  title: "AKAD NIKAH",
                  day: akad?.dayName || "Selasa",
                  date: akad?.dayNumber || "14",
                  month: `${akad?.monthName} ${akad?.year}` || "Mei 2025",
                  time: dataMempelai?.jamAkad || "Pukul 09.00 WIB - Selesai",
                  place: dataMempelai?.lokasiAkad || "Mesjid Baiturrahman",
                  address:
                    dataMempelai?.lokasiAkad ||
                    "Jl. Wonocatur, Wonocatur, Banguntapan, Kec. Banguntapan, Bantul, Yogyakarta",
                },
                {
                  title: "RESEPSI",
                  day: resepsi?.dayName || "Selasa",
                  date: resepsi?.dayNumber || "14",
                  month: `${resepsi?.monthName} ${resepsi?.year}` || "Mei 2025",
                  time: dataMempelai?.jamResepsi || "Pukul 09.00 WIB - Selesai",
                  place: dataMempelai?.lokasiResepsi || "Mesjid Baiturrahman",
                  address:
                    dataMempelai?.lokasiResepsi ||
                    "Jl. Wonocatur, Wonocatur, Banguntapan, Kec. Banguntapan, Bantul, Yogyakarta",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className={`relative bg-white/80 backdrop-blur-lg rounded-[2rem] border ${THEMES[theme].border} shadow-2xl text-center px-6 py-10 overflow-hidden`}
                >
                  {/* Icon Kalender */}
                  <div className="flex justify-center mb-4 relative z-10">
                    <div
                      className={`w-14 h-14 flex items-center justify-center rounded-xl ${THEMES[theme].chip} shadow-md`}
                    >
                      <CalendarDays className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Judul */}
                  <h3
                    className={`text-lg font-semibold tracking-wide mb-2 relative z-10 ${THEMES[theme].textMain}`}
                  >
                    {item.title}
                  </h3>

                  {/* Hari */}
                  <p className="text-gray-500 italic mb-2 relative z-10">
                    {item.day}
                  </p>

                  {/* Tanggal */}
                  <h1
                    className={`text-6xl md:text-7xl font-bold leading-tight relative z-10 ${THEMES[theme].textMain}`}
                  >
                    {item.date}
                  </h1>
                  <p
                    className={`${THEMES[theme].textMain} font-medium mb-4 relative z-10`}
                  >
                    {item.month}
                  </p>

                  {/* Waktu */}
                  <p className="text-gray-600 mb-6 relative z-10">
                    {item.time}
                  </p>

                  {/* Divider */}
                  <div className="w-16 h-[2px] mx-auto bg-gradient-to-r from-transparent via-gray-400 to-transparent mb-6" />

                  {/* Lokasi */}
                  <h4
                    className={`${THEMES[theme].textMain} font-semibold relative z-10`}
                  >
                    {item.place}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed relative z-10">
                    {item.address}
                  </p>

                  {/* Ornamen Glow */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl" />
                </motion.div>
              ))}
            </div>
          </section>

          {/* QR + Map Embed + Gallery small */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="py-10 px-4"
          >
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-2xl border ${T.border} ${T.card} shadow col-span-2`}
              >
                <h4 className="font-semibold mb-2">Peta Lokasi</h4>
                <iframe
                  src={
                    dataMempelai?.linkMaps ||
                    "https://www.google.com/maps?q=-6.244669,106.800483&z=15&output=embed"
                  }
                  width="100%"
                  height="200"
                  className="border-0 rounded-md"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.section>

          {/* Gallery */}
          <Gallery4
            background={THEMES}
            theme={theme}
            datamempelai={dataMempelai}
          />

          {/* Ucapan & Doa + Guest Book form */}
          <section
            className={`relative py-16 px-6 md:px-20 ${THEMES[theme].pageBg}`}
          >
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-serif text-center tracking-wide mb-10"
            >
              Ucapan Doa & RSVP
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {/* Form Ucapan */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl shadow-md ${THEMES[theme].card} border ${THEMES[theme].border}`}
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Kirim Ucapan & Doa
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    value={formData.nama}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/60 outline-none"
                    required
                  />
                  <textarea
                    placeholder="Tulis ucapan & doa terbaik..."
                    rows="4"
                    value={formData.kehadiran}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/60 outline-none resize-none"
                    required
                  />
                  <button
                    type="submit"
                    className={`w-full py-2 rounded-lg font-medium text-white ${THEMES[theme].cta}`}
                  >
                    Kirim
                  </button>
                </form>
              </motion.div>

              {/* List Ucapan */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Ucapan dari Tamu
                </h3>
                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
                  {guestBook.length === 0 ? (
                    <p className="text-gray-500 italic">
                      Belum ada ucapan, jadilah yang pertama 💌
                    </p>
                  ) : (
                    guestBook.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className={`p-4 rounded-lg border ${THEMES[theme].border} bg-white/80 backdrop-blur-md`}
                      >
                        <p className="font-semibold text-gray-900">
                          {entry.name}
                        </p>
                        <p className="text-gray-700 text-sm mt-1">
                          {entry.message}
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Dress Code & Info Tambahan */}
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center py-8 px-4"
          >
            <h3 className={`font-bold text-lg md:text-xl mb-4 ${T.textMain}`}>
              Dress Code & Info
            </h3>
            <p className="max-w-2xl mx-auto text-sm text-gray-700">
              Dress code: Elegant Casual (warna pastel) — Mohon datang tepat
              waktu. Jika membawa anak, pastikan diawasi.
            </p>
          </motion.section>

          {/* Wishlist / Gift Registry */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="py-10 px-4"
          >
            <AmplopGift
              background={THEMES}
              T={theme}
              datamempelai={dataMempelai}
            />
          </motion.section>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative text-center py-10 px-6 mt-12 bg-gradient-to-t from-gray-50 to-white"
          >
            {/* Divider line */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r ${THEMES[theme].cta} rounded-full`}
            ></div>

            {/* Main text */}
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Merupakan suatu kehormatan & kebahagiaan bagi kami apabila <br />
              Bapak/Ibu/Saudara/i berkenan hadir.
            </p>

            {/* Thanks note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>Terima kasih</span>
              <Heart
                size={16}
                className="text-pink-500 animate-pulse"
                fill="currentColor"
              />
              <span>
                {dataMempelai?.panggilanPria || "Putra"} &{" "}
                {dataMempelai?.panggilanWanita || "Putri"}
              </span>
            </div>

            {/* Small copyright */}
            <p className="mt-4 text-xs text-gray-400">
              © {new Date().getFullYear()}{" "}
              {dataMempelai?.panggilanPria || "Putra"} &{" "}
              {dataMempelai?.panggilanWanita || "Putri"} Wedding
            </p>
          </motion.footer>
        </div>
      )}
    </main>
  );
}
