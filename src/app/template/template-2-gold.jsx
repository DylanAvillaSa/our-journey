"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PlayCircle, PauseCircle, Heart } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/libs/config";
import Countdown from "@/components/paket/gold/Countdown";
import LoveStory from "@/components/paket/gold/LoveStory";
import AmplopGift from "@/components/paket/gold/AmplopGift";
import UcapanRSVP from "@/components/paket/gold/RSPV";
import GallerySection from "@/components/paket/gold/Gallery";
import DetailAcara from "@/components/paket/gold/DetailAcara";
import ProfileMempelai from "@/components/paket/gold/ProfileMempelai";
import { useSearchParams } from "next/navigation";

export const defaultData = {
  namaLengkapPria: "Randy",
  namaLengkapWanita: "Santi",
  tanggalPernikahan: "2025-01-01",
  lokasiAcara: "Jakarta",
  linkMaps: "https://maps.google.com/",
};
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

// ===== Variasi Warna (Tambah Tema Baru) =====
const THEMES = {
  lavender: {
    name: "Lavender Dream",
    pageBg:
      "bg-[radial-gradient(1200px_600px_at_20%_0%,#f8eaff,transparent),radial-gradient(1200px_600px_at_100%_10%,#f1e6ff,transparent)] bg-[#faf5ff]",
    headerGrad: "bg-gradient-to-r from-purple-700 via-violet-600 to-pink-600",
    card: "bg-gradient-to-br from-[#faf0ff] via-[#f6e6ff] to-[#fceeff]",
    border: "border-violet-300",
    textMain: "text-purple-900",
    cta: "bg-gradient-to-r from-purple-600 via-violet-500 to-pink-500 hover:from-violet-500 hover:to-pink-400",
    chip: "bg-violet-100 text-violet-800",
  },

  ocean: {
    name: "Ocean Blue",
    pageBg:
      "bg-[radial-gradient(1200px_600px_at_10%_0%,#d0f2ff,transparent),radial-gradient(1200px_600px_at_100%_10%,#e0f7fa,transparent)] bg-[#f0fcff]",
    headerGrad: "bg-gradient-to-r from-sky-700 via-cyan-600 to-blue-700",
    card: "bg-gradient-to-br from-[#e6f9ff] via-[#d6f4ff] to-[#ccefff]",
    border: "border-sky-300",
    textMain: "text-sky-900",
    cta: "bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-500 hover:from-sky-500 hover:to-blue-400",
    chip: "bg-sky-100 text-sky-800",
  },

  sunset: {
    name: "Sunset Glow",
    pageBg:
      "bg-[radial-gradient(1200px_600px_at_-10%_0%,#ffe6d5,transparent),radial-gradient(1200px_600px_at_110%_10%,#ffd6e0,transparent)] bg-[#fff5f0]",
    headerGrad: "bg-gradient-to-r from-pink-700 via-rose-600 to-orange-600",
    card: "bg-gradient-to-br from-[#fff0e6] via-[#ffe4e1] to-[#ffe9d5]",
    border: "border-pink-300",
    textMain: "text-pink-900",
    cta: "bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 hover:from-pink-500 hover:to-orange-400",
    chip: "bg-pink-100 text-pink-800",
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
export default function Template2Gold({ id, data }) {
  const rsvpRef = useRef(null);
  const audioRef = useRef(null);

  const [switcher, setSwitcher] = useState(false);
  const [opened, setOpened] = useState(false);
  const [dataMempelai, setDataMempelai] = useState(data || null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [theme, setTheme] = useState(dataMempelai?.temaWarna || "lavender");

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
  const searchParams = useSearchParams();
  const namaTamu = searchParams.get("to");

  const [guestForm, setGuestForm] = useState({ name: "", message: "" });
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/gallery/p1.jpg",
    "/gallery/p2.jpg",
    "/gallery/p3.jpg",
    "/gallery/p4.jpg",
  ];
  const T = THEMES[theme];

  const handleOpen = () => setOpened(true);

  // ambil data dari database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ambil data berdasarkan email atau template
        const q = query(
          collection(db, "pembelian"),
          where("template", "==", "Gold 2"),
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1));
    }, 4000); // ganti slide tiap 4 detik
    return () => clearInterval(timer);
  }, [slides?.length]);

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
      `${dataMempelai?.panggilanPria} & ${dataMempelai?.panggilanWanita}`
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      "Acara pernikahan kami"
    )}&location=${encodeURIComponent("Masjid Al-Falah, Jakarta Selatan")}`;

    window.open(url, "_blank");
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
        src={dataMempelai?.backsound}
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

      {/* ===== Welcome Screen ===== */}
      {!opened && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Background Image + Overlay */}
          <div className="absolute inset-0">
            <Image
              src={dataMempelai?.fotoSampul[0] || "/images/bg.jpg"}
              alt="Background Wedding"
              fill
              className="object-cover w-full min-h-screen"
              priority
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
          </div>

          {/* Floating Ornaments */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-16 right-16 w-40 h-40 bg-yellow-200/30 rounded-full blur-3xl animate-pulse"></div>

          {/* Content */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative z-10 text-center max-w-lg w-full px-6"
          >
            <p className="mb-3 text-sm text-gray-200 tracking-wide uppercase">
              We Invite You To
            </p>

            {/* Foto pasangan */}
            <div
              className={`relative w-44 h-44 mx-auto mb-6 rounded-full border-4 ${THEMES[theme].border} shadow-2xl overflow-hidden`}
            >
              <Image
                src={dataMempelai?.fotoSampul[1] || "/foto-dummy/latar.jpg"}
                alt="Pasangan"
                fill
                className="object-cover"
              />
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 rounded-full border-2 ${THEMES[theme].border} animate-pulse`}
              ></div>
            </div>

            {/* Nama */}
            <h1
              className={`font-[--greatVibes] text-5xl md:text-6xl mb-3 text-transparent bg-clip-text ${THEMES[theme].card}`}
            >
              {dataMempelai?.panggilanPria} & {dataMempelai?.panggilanWanita}
            </h1>

            {/* Deskripsi */}
            <p className="mt-2 text-base text-gray-100 leading-relaxed">
              Dengan penuh rasa syukur, kami mengundang Anda
              <br />
              untuk hadir di acara pernikahan kami.
            </p>

            <p className="text-xl mt-3 md:text-2xl font-semibold text-white mb-1">
              {namaTamu || "Nama Tamu"}
            </p>

            {/* Tombol Buka */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="mt-5 relative inline-block px-8 py-3 rounded-full font-semibold text-white shadow-lg overflow-hidden"
            >
              <span
                className={`absolute inset-0 bg-gradient-to-r ${THEMES[theme].cta} animate-gradient-x`}
              ></span>
              <span className="relative z-10">Buka Undangan ✨</span>
            </motion.button>
          </motion.div>
        </motion.section>
      )}

      {/* ===== UNDANGAN LENGKAP ===== */}
      {opened && (
        <div className="relative z-10 pb-24">
          {/* Hero Section */}
          {/* Background utama dengan style elegan */}
          <div className="relative w-full h-[420px] overflow-hidden rounded-b-xl shadow-2xl">
            <Image
              src={
                dataMempelai?.fotoSampul[0] ||
                dataMempelai?.fotoSampul[1] ||
                "/images/bg-wedding.jpg"
              }
              width={1920}
              height={1080}
              alt="Pasangan"
              className="object-cover w-full h-full scale-105 transform"
              priority
            />

            {/* Overlay gradasi biar teks lebih jelas */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

            {/* Frame tipis gold (opsional) */}
            <div
              className={`absolute inset-0 rounded-b-xl border-b-4 ${THEMES[theme].border}  pointer-events-none`}
            ></div>
          </div>

          {/* Nama & Detail */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative text-center py-24 px-4 mt-2 overflow-hidden"
          >
            {/* Ornament Atas */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 md:w-96 opacity-55 z-10 pointer-events-none"
            >
              <img
                src="/asset/ornament-atas.png"
                alt="ornament atas"
                className="w-full"
              />
            </motion.div>

            {/* TEXT */}
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.6 }}
              className={`relative z-20 font-[var(--font-vibes)] text-xl md:text-4xl mb-2 text-transparent bg-clip-text ${T.headerGrad}`}
            >
              The Wedding Of
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true, amount: 0.6 }}
              className={`relative z-20 text-4xl flex justify-center gap-2 md:text-4xl font-extrabold mb-2 text-transparent bg-clip-text ${T.headerGrad}`}
            >
              {dataMempelai?.panggilanPria} &{" "}
              <p className="pt-3">{dataMempelai?.panggilanWanita}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveDate}
              className={`${THEMES[theme].cta} relative z-20 rounded-xl px-4 py-2 w-[150px] flex justify-center items-center mx-auto mb-5 mt-5 text-sm text-white cursor-pointer shadow-lg`}
            >
              <p>Save The Date</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              viewport={{ once: true, amount: 0.6 }}
              className="relative z-20 font-[var(--font-playfair)] text-sm md:text-base max-w-md mx-auto text-gray-700"
            >
              {dataMempelai?.tanggalAkad}
              <br />
              {dataMempelai?.lokasiAkad}
            </motion.p>
          </motion.section>

          {/* Countdown */}
          <div className="px-4">
            <Countdown
              date={dataMempelai?.countdownDate}
              waktu={dataMempelai?.countdownTime}
            />
          </div>

          {/* Profile Mempelai */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-10 px-4 mt-8 relative"
          >
            <ProfileMempelai
              T={theme}
              background={THEMES}
              datamempelai={dataMempelai}
            />
          </motion.section>

          {/* Love Story Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="py-10 px-4 relative"
          >
            <LoveStory
              T={theme}
              background={THEMES}
              datamempelai={dataMempelai}
            />
          </motion.section>

          {/* Gallery */}
          <GallerySection datamempelai={dataMempelai} />

          {/* Detail Acara (Akad & Resepsi) */}
          <DetailAcara
            T={theme}
            background={THEMES}
            datamempelai={dataMempelai}
          />

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
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.53239897237!2d106.82715237569926!3d-6.175392860475799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e7cbf1e3db%3A0x2c58d9bdfa4b0b0!2sMonas!5e0!3m2!1sid!2sid!4v1700000000000"
                  }
                  width="100%"
                  height="200"
                  className="border-0 rounded-md"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.section>

          {/* Ucapan & Doa + Guest Book form */}
          <UcapanRSVP T={theme} background={THEMES} />

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
                {dataMempelai?.panggilanPria} & {dataMempelai?.panggilanWanita}
              </span>
            </div>

            {/* Small copyright */}
            <p className="mt-4 text-xs text-gray-400">
              © {new Date().getFullYear()} {dataMempelai?.panggilanPria} &{" "}
              {dataMempelai?.panggilanWanita} Wedding
            </p>
          </motion.footer>
        </div>
      )}
    </main>
  );
}
