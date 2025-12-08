"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { parseDate, formatTime } from "@/config/formatDate";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/libs/config";
import AmplopGift from "@/components/paket/gold/AmplopGift";
import Image from "next/image";
import { PlayCircle, PauseCircle, Heart } from "lucide-react";
import TheDate from "@/components/paket/gold/CountdownVersi2";
import { CalendarDays } from "lucide-react";
import Gallery3 from "@/components/paket/gold/GallerySectionVersi3";
import { Bird } from "lucide-react";
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
export const THEMES = {
  // 🔹 Varian 1: Royal Gold & Burgundy
  monochrome: {
    pageBg:
      "bg-[radial-gradient(1400px_900px_at_20%_-10%,#f5f5f5,transparent),radial-gradient(1400px_900px_at_100%_0%,#eaeaea,transparent)] bg-[#ffffff]",
    headerGrad: "bg-gradient-to-r from-black via-gray-800 to-gray-900",
    card: "bg-gradient-to-br from-[#ffffff]/90 via-[#f7f7f7]/80 to-[#fdfdfd]/90 backdrop-blur-lg",
    border: "border-gray-400",
    textMain: "text-gray-900",
    cta: "bg-gradient-to-r from-black via-gray-800 to-gray-700 hover:from-gray-700 hover:to-black",
    chip: "bg-gray-200 text-gray-900",
  },
  // 🔹 Varian 2: Sapphire Blue & Silver
  sapphire: {
    pageBg:
      "bg-[radial-gradient(1400px_900px_at_20%_-10%,#e6f0ff,transparent),radial-gradient(1400px_900px_at_100%_0%,#f0f7ff,transparent)] bg-[#f9fbff]",
    headerGrad: "bg-gradient-to-r from-blue-900 via-sky-600 to-indigo-500",
    card: "bg-gradient-to-br from-[#f0f8ff]/80 via-[#f5faff]/70 to-[#eef6ff]/80 backdrop-blur-lg",
    border: "border-sky-400",
    textMain: "text-blue-900",
    cta: "bg-gradient-to-r from-indigo-600 via-sky-600 to-blue-700 hover:from-indigo-500 hover:to-sky-500",
    chip: "bg-sky-100 text-sky-800",
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
export default function Template4Gold({ id, data }) {
  const searchParams = useSearchParams();
  const namaTamu = searchParams.get("to");
  const rsvpRef = useRef(null);
  const audioRef = useRef(null);
  const [switcher, setSwitcher] = useState(false);
  const [dataMempelai, setDataMempelai] = useState(data || null);
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [theme, setTheme] = useState("monochrome");

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

  const yBird = useTransform(scrollYProgress, [0, 1], [0, 50]); // burung gerak turun
  const yText = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const handleOpen = () => setOpened(true);

  // ambil data dari database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ambil data berdasarkan email atau template
        const q = query(
          collection(db, "pembelian"),
          where("template", "==", "Gold 4"),
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

  const akad = parseDate(dataMempelai?.tanggalAkad);

  const jamAkad = formatTime(dataMempelai?.jamAkad);
  const resepsi = parseDate(dataMempelai?.tanggalResepsi);
  const jamResepsi = formatTime(dataMempelai?.jamResepsi);

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
          className="relative min-h-screen flex items-center justify-center text-center"
        >
          {/* Background foto pasangan */}
          <Image
            src={dataMempelai?.fotoSampul[0] || "/images/bg-wedding.jpg"} // ganti sesuai foto lu
            alt="Pasangan"
            fill
            priority
            className="object-cover"
          />

          {/* Overlay warna elegan */}
          <div className={`absolute inset-0 ${THEMES[theme].cta} opacity-55`} />

          {/* Konten */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 max-w-md w-full px-6"
          >
            {/* Judul kecil */}
            <p
              className={`text-sm tracking-[4px] ${THEMES[theme].chip} uppercase mb-4`}
            >
              The Wedding Of
            </p>

            {/* Nama mempelai */}
            <h1 className="font-[--playfair] text-4xl md:text-5xl font-bold text-white mb-6">
              {dataMempelai?.panggilanWanita || "Anna"} &{" "}
              {dataMempelai?.panggilanPria || "Dandy"}
            </h1>

            {/* Undangan untuk tamu */}
            <p className="text-white mb-2">Dear,</p>
            <p className="text-xl font-semibold text-white mb-4">
              {namaTamu || "Nama Tamu"}
            </p>
            <p className="text-white/90 mb-6 text-sm leading-relaxed">
              Tanpa mengurangi hormat, kami mengundang anda untuk hadir di acara
              pernikahan kami.
            </p>

            {/* Tombol */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="border border-white text-white px-6 py-2 rounded-md font-medium tracking-wide hover:bg-white hover:text-[#843939] transition"
            >
              Buka Undangan
            </motion.button>

            {/* Catatan kecil */}
            <p className="mt-6 text-xs text-white/80">
              Mohon maaf apabila ada kesalahan penulisan nama/gelar
            </p>
          </motion.div>
        </motion.section>
      )}

      {/* ===== UNDANGAN LENGKAP ===== */}
      {opened && (
        <div className="relative z-10 pb-24">
          {/* Banner Section */}
          <div className="relative w-full h-[100vh] overflow-hidden">
            {/* Background dengan efek parallax */}
            <motion.div style={{ y, scale }} className="absolute inset-0">
              <Image
                src={dataMempelai?.fotoSampul[1] || "/images/bg-wedding.jpg"}
                width={1920}
                height={1080}
                alt="Pasangan"
                className="object-cover w-full h-full scale-110"
                priority
              />
            </motion.div>

            {/* Overlay gelap */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Konten Utama */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10 text-white">
              {/* The Wedding Of */}
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="uppercase tracking-widest text-sm md:text-base text-gray-200 mb-3"
              >
                The Wedding Of
              </motion.p>

              {/* Nama Pasangan */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="font-[var(--font-vibes)] text-4xl md:text-6xl font-bold drop-shadow-lg"
              >
                {dataMempelai?.panggilanWanita || "Anna"} &{" "}
                {dataMempelai?.panggilanPria || "Dandy"}
              </motion.h1>

              {/* Tanggal */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="mt-6 text-sm md:text-lg tracking-wide"
              >
                {dataMempelai?.tanggalAkad || "Maret • 12 • 2025"}
              </motion.p>
            </div>
          </div>

          {/* Ayat Pembuka */}
          <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`relative bg-gradient-to-br ${THEMES[theme].cta} text-white py-16 px-6 text-center rounded-b-[80px] shadow-xl overflow-hidden`}
          >
            {/* Icon burung */}
            <motion.div
              style={{ y: yBird }}
              className="flex justify-center mb-6"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-md">
                <Bird className="w-7 h-7" />
              </div>
            </motion.div>

            {/* Ayat */}
            <motion.p
              style={{ y: yText }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-lg leading-relaxed max-w-2xl mx-auto font-light italic"
            >
              “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
              pasangan-pasangan untukmu dari jenismu sendiri, agar kamu
              cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di
              antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu
              benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang
              berpikir.”
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              viewport={{ once: true }}
              className="mt-4 font-semibold text-sm tracking-wide"
            >
              ( QS. Ar-Rum 21 )
            </motion.p>
          </motion.section>

          {/* Salam Pembuka */}
          <motion.section
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative bg-white text-center py-16 px-6 overflow-hidden"
          >
            <motion.h3
              style={{ y: yText }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-2xl font-[GreatVibes] text-[#b23a48] mb-6"
            >
              Assalamualaikum Wr. Wb.
            </motion.h3>

            <motion.p
              style={{ y: yText }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-gray-700 max-w-xl mx-auto leading-relaxed"
            >
              Tanpa mengurangi rasa hormat, kami bermaksud mengundang
              Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami
            </motion.p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative py-20 px-6 overflow-hidden"
          >
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
                className="relative flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-xl border border-pink-200"
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
                  {dataMempelai?.namaLengkapWanita || "Anna"}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  Putri dari Bapak{" "}
                  {dataMempelai?.ayahMempelaiWanita || "Samsuri"} & Ibu{" "}
                  {dataMempelai?.ibuMempelaiWanita || "Alie"}
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
                className="relative flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-xl border border-blue-200"
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
                  {dataMempelai?.namaLengkapPria || "Vidi Lukman"}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  Putra dari Bapak {dataMempelai?.ayahMempelaiPria || "Yusuf"} &
                  Ibu {dataMempelai?.ibuMempelaiWanita || "Aminah"}
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
            className="py-20 px-6 relative max-w-4xl mx-auto"
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
                        className={`relative w-full md:w-[45%] bg-white rounded-2xl shadow-xl border border-pink-100 p-6`}
                      >
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
                        <p className="text-sm text-gray-400">{item.when}</p>
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
                        className={`relative w-full md:w-[45%] bg-white rounded-2xl shadow-xl border border-pink-100 p-6`}
                      >
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
                        <p className="text-sm text-gray-400">{item.when}</p>
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

          {/* countdown */}
          <section className="relative py-16 px-6 max-w-2xl mx-auto">
            <TheDate
              background={THEMES}
              theme={theme}
              datamempelai={dataMempelai}
            />

            {/* Card Acara */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              viewport={{ once: true }}
              className={`bg-white rounded-[2.5rem] border ${THEMES[theme].border} shadow-xl text-center px-6 py-10`}
            >
              {/* Icon Kalender */}
              <div className="flex justify-center mb-4">
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl ${THEMES[theme].chip} ${THEMES[theme].chip} shadow-md`}
                >
                  <CalendarDays className="w-7 h-7" /> {/* ✅ Icon Lucide */}
                </div>
              </div>

              {/* Judul */}
              <h3
                className={`text-lg font-semibold ${THEMES[theme].textMain} tracking-wide mb-2`}
              >
                AKAD NIKAH
              </h3>

              <p className="text-gray-500 italic mb-2">
                {akad?.dayName || "Selasa"}
              </p>

              <h1
                className={`text-5xl md:text-6xl font-bold ${THEMES[theme].textMain} leading-tight`}
              >
                {akad?.dayNumber || "00"}
              </h1>
              <p className={`${THEMES[theme].textMain} font-medium mb-4`}>
                {akad
                  ? `${akad.monthName} ${akad.year}`
                  : "Tanggal tidak tersedia"}
              </p>

              <p className="text-gray-600 mb-6">
                {" "}
                Pukul {jamAkad} WIB - Selesai
              </p>

              {/* Lokasi */}
              <h4 className={`${THEMES[theme].textMain} font-semibold`}>
                {dataMempelai?.lokasiAkad || "Lokasi belum diisi"}
              </h4>
            </motion.div>

            {/* Card Resepsi */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              viewport={{ once: true }}
              className={`bg-white rounded mt-8 border ${THEMES[theme].border} shadow-xl text-center px-6 py-10`}
            >
              {/* Icon Kalender */}
              <div className="flex justify-center mb-4">
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl ${THEMES[theme].chip} shadow-md`}
                >
                  <CalendarDays className="w-7 h-7" />
                </div>
              </div>

              {/* Judul */}
              <h3
                className={`text-lg font-semibold ${THEMES[theme].textMain} tracking-wide mb-2`}
              >
                RESEPSI
              </h3>

              {/* Hari */}
              <p className="text-gray-500 italic mb-2">
                {resepsi?.dayName || "Hari belum ditentukan"}
              </p>

              {/* Tanggal */}
              <h1
                className={`text-5xl md:text-6xl font-bold ${THEMES[theme].textMain} leading-tight`}
              >
                {resepsi?.dayNumber || "00"}
              </h1>

              {/* Bulan + Tahun */}
              <p className={`${THEMES[theme].textMain} font-medium mb-4`}>
                {resepsi
                  ? `${resepsi.monthName} ${resepsi.year}`
                  : "Tanggal belum diisi"}
              </p>

              {/* Jam */}
              <p className="text-gray-600 mb-6">
                Pukul {jamResepsi} WIB - Selesai
              </p>

              {/* Lokasi */}
              <h4 className={`${THEMES[theme].textMain} font-semibold`}>
                {dataMempelai?.lokasiResepsi || "Lokasi belum diisi"}
              </h4>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {dataMempelai?.lokasiResepsi || "Alamat belum diisi"}
              </p>
            </motion.div>
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
          <Gallery3
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
                {dataMempelai?.panggilanPria || "Dandy"} &{" "}
                {dataMempelai?.panggilanWanita || "Anna"}
              </span>
            </div>

            {/* Small copyright */}
            <p className="mt-4 text-xs text-gray-400">
              © {new Date().getFullYear()}{" "}
              {dataMempelai?.panggilanPria || "Dandy"} &{" "}
              {dataMempelai?.panggilanWanita || "Anna"} Wedding
            </p>
          </motion.footer>
        </div>
      )}
    </main>
  );
}
