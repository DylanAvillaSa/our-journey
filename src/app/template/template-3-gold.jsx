"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PlayCircle, PauseCircle, Heart } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/libs/config";
import Countdown2 from "@/components/paket/gold/Countdown";
import AmplopGift from "@/components/paket/gold/AmplopGift";
import GallerySection2 from "@/components/paket/gold/GallerySectionVersi2";
import DetailAcara2 from "@/components/paket/gold/DetailAcara2";
import UcapanRSVP2 from "@/components/paket/gold/UcapanRSPV2";
import { useSearchParams } from "next/navigation";

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
const THEMES = {
  blush: {
    name: "Blush Rose",
    pageBg:
      "bg-[radial-gradient(1200px_600px_at_20%_0%,#fff7f9,transparent),radial-gradient(1200px_600px_at_100%_20%,#fff0f5,transparent)] bg-[#fffafa]",
    headerGrad: "bg-gradient-to-r from-rose-500 via-pink-400 to-rose-300",
    card: "bg-gradient-to-br from-[#fff5f7] via-[#ffeef2] to-[#ffe6eb]",
    border: "border-rose-300",
    textMain: "text-rose-900",
    cta: "bg-gradient-to-r from-rose-500 via-pink-400 to-rose-300 hover:from-rose-400 hover:to-pink-300",
    chip: "bg-rose-100 text-rose-800",
  },

  royal: {
    name: "Royal Navy",
    pageBg:
      "bg-[radial-gradient(1200px_600px_at_10%_0%,#f5f7ff,transparent),radial-gradient(1200px_600px_at_100%_30%,#eef2ff,transparent)] bg-[#fafbff]",
    headerGrad: "bg-gradient-to-r from-indigo-900 via-blue-700 to-sky-500",
    card: "bg-gradient-to-br from-[#f0f4ff] via-[#e6ecff] to-[#dce4ff]",
    border: "border-indigo-300",
    textMain: "text-indigo-900",
    cta: "bg-gradient-to-r from-indigo-700 via-blue-600 to-sky-500 hover:from-indigo-600 hover:to-blue-400",
    chip: "bg-indigo-100 text-indigo-800",
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
export default function Template3Gold({ id, data }) {
  const searchParams = useSearchParams();
  const namaTamu = searchParams.get("to");
  const rsvpRef = useRef(null);
  const audioRef = useRef(null);

  const [switcher, setSwitcher] = useState(false);
  const [opened, setOpened] = useState(false);
  const [dataMempelai, setDataMempelai] = useState(data || null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [theme, setTheme] = useState("blush");

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

  const [guestForm, setGuestForm] = useState({ name: "", message: "" });
  const T = THEMES[theme];

  const handleOpen = () => setOpened(true);

  // ambil data dari database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ambil data berdasarkan email atau template
        const q = query(
          collection(db, "pembelian"),
          where("template", "==", "Gold 3"),
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
      `${dataMempelai?.panggilanPria} & ${dataMempelai?.panggilanWanita} Wedding`
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
          transition={{ duration: 1 }}
          className="relative min-h-screen flex items-center justify-center"
        >
          {/* Background Foto */}
          <Image
            src={dataMempelai?.fotoSampul[0] || "/images/bg-wedding.jpg"}
            alt="Pasangan"
            fill
            className="object-cover w-full h-full opacity-95"
            priority
          />

          {/* Overlay gelap tipis biar teks keliatan */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Konten Tengah */}
          <div className="relative z-10 text-center text-white px-6">
            <p className="text-sm italic mb-2">The Wedding Of</p>

            {/* Ornamen lingkaran daun + inisial */}
            <div
              className={`mx-auto w-44 h-44 flex items-center justify-center rounded-full border-4 ${THEMES[theme].border} relative mb-6`}
            >
              <span className="text-3xl font-bold">
                {" "}
                {dataMempelai?.panggilanPria[0].toUpperCase()} &{" "}
                {dataMempelai?.panggilanWanita[0].toUpperCase()}
              </span>
            </div>

            <p className="mb-1 text-base">Kepada Yth.</p>
            <h2 className="text-xl font-semibold mb-6">
              {namaTamu || "Nama Tamu"}
            </h2>

            {/* Tombol Buka Undangan */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className={`bg-gradient-to-r ${THEMES[theme].cta} text-white px-8 py-3 rounded-full shadow-lg flex items-center justify-center gap-2 mx-auto`}
            >
              <span>📖</span> Buka Undangan
            </motion.button>
          </div>
        </motion.section>
      )}

      {/* ===== UNDANGAN LENGKAP ===== */}
      {opened && (
        <div className="relative z-10 pb-24">
          {/* Banner Section */}
          <div className="relative w-full h-[100vh] overflow-hidden">
            {/* Background dengan efek zoom */}
            <Image
              src={dataMempelai?.fotoSampul[1] || "/images/bg-wedding.jpg"}
              width={1920}
              height={1080}
              alt="Pasangan"
              className="object-cover w-full h-full scale-110 animate-slow-zoom"
              priority
            />

            {/* Overlay gelap biar teks lebih jelas */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Konten Utama */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10 text-white">
              {/* The Wedding Of */}
              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-[var(--font-playfair)] text-lg md:text-2xl mb-2"
              >
                The Wedding Of
              </motion.h1>

              {/* Nama Pasangan */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="flex gap-2 items-center justify-center text-3xl md:text-5xl font-bold"
              >
                <span className="font-[var(--font-vibes)]">
                  {dataMempelai?.panggilanPria}
                </span>
                <span className="font-[var(--font-vibes)] text-4xl">&</span>
                <span className="font-[var(--font-vibes)]">
                  {dataMempelai?.panggilanWanita}
                </span>
              </motion.div>

              {/* Save The Date */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="mt-3 font-[var(--font-vibes)] text-2xl md:text-3xl"
              >
                Save The Date
              </motion.p>

              {/* Countdown */}
              <div className="px-4">
                <Countdown2
                  date={dataMempelai?.countdownDate}
                  waktu={dataMempelai?.countdownTime}
                />
              </div>

              {/* Box tanggal */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className={`${THEMES[theme].cta} mt-6 bg-white rounded-xl shadow-lg flex items-center px-6 py-3`}
              >
                <span className="font-bold text-lg">
                  {dataMempelai?.tanggalAkad}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Profile Mempelai */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-16 px-6 relative bg-gradient-to-b from-white to-gray-50"
          >
            {/* Judul Section */}
            <div className="text-center mb-12">
              <h2 className="font-[var(--font-playfair)] text-2xl md:text-4xl text-gray-800 mb-2">
                Profil Mempelai
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Dengan memohon rahmat dan ridho Allah SWT, perkenankanlah kami
                mempersembahkan kisah bahagia ini
              </p>
            </div>

            {/* Grid Profile */}
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Mempelai Wanita */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6">
                  <Image
                    src={
                      dataMempelai?.fotoMempelaiWanita[0] ||
                      "/foto-dummy/wanita.png"
                    }
                    alt="Mempelai Wanita"
                    fill
                    className="rounded-full object-cover border-4 border-[var(--color-primary)] shadow-md"
                  />
                </div>
                <h3 className="font-[var(--font-vibes)] text-3xl text-gray-800">
                  {dataMempelai?.panggilanWanita || "Anissa"}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  Putri dari Bapak {dataMempelai?.ayahMempelaiWanita} & Ibu{" "}
                  {dataMempelai?.ibuMempelaiWanita}
                </p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-md">
                  Seorang wanita penyayang, penuh perhatian, dan selalu ceria
                  yang kini siap melangkah menuju babak baru kehidupannya.
                </p>
              </motion.div>

              {/* Mempelai Pria */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg"
              >
                <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6">
                  <Image
                    src={
                      dataMempelai?.fotoMempelaiPria[0] ||
                      "/foto-dummy/pria.png"
                    }
                    alt="Mempelai Pria"
                    fill
                    className="rounded-full object-cover border-4 border-[var(--color-primary)] shadow-md"
                  />
                </div>
                <h3 className="font-[var(--font-vibes)] text-3xl text-gray-800">
                  {dataMempelai?.panggilanPria}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  Putra dari Bapak {dataMempelai?.ayahMempelaiPria || "Samsul"}{" "}
                  & Ibu {dataMempelai?.ibuMempelaiPria || "Maryam"}
                </p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-md">
                  Seorang pria sederhana, penuh tanggung jawab, dan sabar yang
                  telah menemukan belahan jiwanya.
                </p>
              </motion.div>
            </div>

            {/* Ornamen Dekorasi */}
            <motion.img
              src="/asset/florar.png"
              alt="ornamen kiri"
              className="absolute top-0 left-0 w-28 md:w-48 opacity-60 pointer-events-none"
              initial={{ opacity: 0, x: -50, rotate: -10 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            />

            <motion.img
              src="/asset/florar.png"
              alt="ornamen kanan"
              className="absolute bottom-0 right-0 w-32 md:w-40 opacity-60 pointer-events-none"
              initial={{ opacity: 0, x: 50, rotate: 10 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
            />
          </motion.section>

          {/* Love Story Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="py-14 px-6 relative max-w-3xl mx-auto"
          >
            <h2
              className={`text-2xl md:text-3xl font-[var(--font-vibes)] text-center mb-10 text-transparent bg-clip-text ${THEMES[theme].headerGrad}`}
            >
              Our Love Story
            </h2>

            <div className="relative border-l-4 border-dashed border-gray-300 dark:border-gray-600">
              {dataMempelai?.loveStory.length > 0
                ? dataMempelai?.loveStory.map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="mb-10 ml-6 relative"
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: idx * 0.2,
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      {/* Dot Icon */}
                      <span
                        className={`absolute -left-3 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${THEMES[theme].cta}`}
                      >
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                      </span>

                      {/* Card */}
                      <div
                        className={`bg-white dark:${THEMES[theme].chip} rounded-xl shadow-lg p-5`}
                      >
                        <p className="text-sm text-gray-400">{item.when}</p>
                        <h3
                          className={`text-lg font-semibold ${THEMES[theme].text}`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400">{item.text}</p>
                      </div>
                    </motion.div>
                  ))
                : [
                    {
                      title: "Kenalan",
                      when: "2018",
                      text: "Ketemu di kafe dekat kampus. Dari obrolan ringan sampai akhirnya sering ketemu.",
                    },
                    {
                      title: "Jadian",
                      when: "2019",
                      text: "Mulai pacaran setelah beberapa bulan PDKT yang penuh deg-degan.",
                    },
                    {
                      title: "Lamaran",
                      when: "2024",
                      text: "Lamaran sederhana di rumah keluarga dengan penuh kebahagiaan.",
                    },
                    {
                      title: "Menikah",
                      when: "2025",
                      text: "Akhirnya resmi mengikat janji suci dan memulai perjalanan hidup bersama ❤️",
                      highlight: true,
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="mb-10 ml-6 relative"
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: idx * 0.2,
                      }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      {/* Dot Icon */}
                      <span
                        className={`absolute -left-3 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${THEMES[theme].cta}`}
                      >
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                      </span>

                      {/* Card */}
                      <div
                        className={`bg-white dark:${THEMES[theme].chip} rounded-xl shadow-lg p-5`}
                      >
                        <p className="text-sm text-gray-400">{item.when}</p>
                        <h3
                          className={`text-lg font-semibold ${THEMES[theme].text}`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400">{item.text}</p>
                      </div>
                    </motion.div>
                  ))}
            </div>
          </motion.section>

          {/* Gallery */}
          <GallerySection2 datamempelai={dataMempelai} />

          {/* Detail Acara (Akad & Resepsi) */}
          <DetailAcara2
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
          <UcapanRSVP2 T={theme} background={THEMES} />

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
                {dataMempelai?.panggilanPria || "Hamzah"} &{" "}
                {dataMempelai?.panggilanWanita || "Syahla"}
              </span>
            </div>

            {/* Small copyright */}
            <p className="mt-4 text-xs text-gray-400">
              © {new Date().getFullYear()}{" "}
              {dataMempelai?.panggilanPria || "Hamzah"} &{" "}
              {dataMempelai?.panggilanWanita || "Syahla"} Wedding
            </p>
          </motion.footer>
        </div>
      )}
    </main>
  );
}
