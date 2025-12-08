"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Instagram, MailIcon, MapPin } from "lucide-react";
import BottomNavigation from "@/components/ui/BottomNavigation";
import GaleriPlatinum1 from "@/components/paket/platinum/GaleriFoto";
import { fonts } from "../layout";
import { useInView } from "framer-motion";
import WeddingGift from "@/components/paket/platinum/WeddingGift";
import CountdownAkad from "@/components/paket/platinum/CountDown";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/libs/config";

const OurJourneyContent = () => {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [namaTamu, setNamaTamu] = useState("Tamu Undangan");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [ucapanPesertaHadir, setUcapanPesertaHadir] = useState([]);
  const totalPages = Math.ceil(ucapanPesertaHadir.length / itemsPerPage);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    konfirmasi_kehadiran: "",
    ucapan: "",
  });
  const tanggalRef = useRef(null);
  const [tanggal, setTanggal] = useState(17);
  const audioRef = useRef(null);
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnimasi, setShowAnimasi] = useState(true);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentComments = ucapanPesertaHadir.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const tanggalPernikahan = 17;
  const isInView = useInView(tanggalRef, { once: true, amount: 0.5 });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "ucapan"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUcapanPesertaHadir(data);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const interval = setInterval(() => {
        start++;
        setTanggal((prev) => {
          if (prev >= tanggalPernikahan) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 100); // speed counter (100ms)

      return () => clearInterval(interval);
    }
  }, [isInView, tanggalPernikahan]);

  // Animasi container
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, staggerChildren: 0.15 },
    },
  };

  useEffect(() => {
    if (opened) {
      // Durasi total animasi sebelum hilang: delay + duration
      const timer = setTimeout(() => {
        setShowAnimasi(false); // otomatis hilang
      }, 5000 + 3000); // duration 5s + delay 3s
      return () => clearTimeout(timer);
    }
  }, [opened]);

  useEffect(() => {
    if (opened && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [opened]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const pesertaHadir = ucapanPesertaHadir.filter(
    (peserta) => peserta.konfirmasi_kehadiran === "hadir"
  );

  const pesertaTidakHadir = ucapanPesertaHadir.filter(
    (peserta) => peserta.konfirmasi_kehadiran !== "hadir"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi minimal
    if (
      !formData.nama_lengkap.trim() ||
      !formData.konfirmasi_kehadiran.trim()
    ) {
      alert("Nama lengkap dan konfirmasi kehadiran wajib diisi!");
      return;
    }

    if (formData.ucapan.length > 500) {
      alert("Ucapan terlalu panjang, maksimal 500 karakter.");
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedData = {
        nama_lengkap: formData.nama_lengkap.trim(),
        konfirmasi_kehadiran: formData.konfirmasi_kehadiran.trim(),
        ucapan: formData.ucapan.trim(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "ucapan"), sanitizedData);

      // Tampilkan modal sukses
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
    } finally {
      setFormData({ konfirmasi_kehadiran: "", nama_lengkap: "", ucapan: "" });
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const to = searchParams.get("to");
    if (to) {
      setNamaTamu(decodeURIComponent(to));
    }
  }, [searchParams]);

  return (
    <section className="relative w-full h-screen overflow-hidden ">
      {/* === Halaman Cover === */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -500 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col justify-between items-center py-20 text-white gap-5 
                 bg-center bg-cover bg-no-repeat bg-[url(/aset-foto/sampul.webp)] 
                 before:content-[''] before:absolute before:inset-0 before:bg-black/40"
          >
            {/* Konten di atas gambar */}
            <div className="relative z-10 flex flex-col gap-5 items-center">
              <h3
                className={`font-semibold text-white ${fonts.greatVibes.className} text-4xl`}
              >
                The Wedding Of
              </h3>
              <h2
                className={`font-bold text-3xl ${fonts.playfair.className} text-[#f0d5a3]`}
              >
                Adam & Ria
              </h2>
            </div>

            {/* Konten bawah */}
            <div className="relative z-10 flex flex-col gap-5 items-center">
              <p className="text-white text-shadow-2xs font-bold">Kepada Yth</p>
              <h3 className="text-[#e3bd76] text-shadow-amber-900 font-bold text-shadow-2xs">
                {namaTamu}
              </h3>
              <button
                onClick={() => setOpened(true)}
                className="py-2 px-4 flex items-center justify-center gap-2 bg-[#d8a649] text-white font-light 
                     w-[180px] rounded-md hover:bg-[#dfc89c] transition-colors"
              >
                <MailIcon className="w-5 h-5" />
                Buka undangan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Halaman Undangan + Musik === */}
      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden"
          >
            <BottomNavigation onNavigate={scrollToSection} />

            {/* Animasi*/}
            <AnimatePresence>
              <motion.div
                className="inset-0 relative w-full min-h-screen z-0 "
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Animasi Pembuka */}
                <motion.div id="Animasi-pembuka">
                  {/* Gerbang */}
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={opened ? { scale: 1.5 } : { scale: 1 }}
                    transition={{ duration: 5, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center z-20"
                    style={{
                      willChange: "transform, opacity",
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* border gerbang */}
                    <motion.div
                      initial={{ scale: 1, opacity: 1 }}
                      animate={
                        opened
                          ? { scale: 5, opacity: 0 }
                          : { scale: 1, opacity: 1 }
                      }
                      transition={{ duration: 7, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        transformOrigin: "center center",
                        willChange: "transform, opacity",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <Image
                        src="/asset/aset-ornament/border-gerbang.webp"
                        width={700}
                        height={700}
                        priority
                        className="w-full h-auto opacity-90"
                        alt="border"
                      />
                    </motion.div>

                    {/* Gerbang kiri */}
                    <motion.div
                      initial={{ rotateY: 0 }}
                      animate={opened ? { rotateY: -90 } : { rotateY: 0 }}
                      transition={{ duration: 5, ease: "easeInOut" }}
                      className="absolute top-1/2 scale-[2.8] -translate-y-1/2 -left-[33vw] w-[40vw] max-w-[300px]"
                      style={{
                        transformOrigin: "left center",
                        willChange: "transform, opacity",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <Image
                        src="/asset/aset-ornament/gerbang-kanan-putih.webp"
                        width={700}
                        height={700}
                        loading="eager"
                        style={{ transform: "scaleX(-1)" }}
                        className="w-full h-auto opacity-100"
                        alt="gerbang kanan"
                      />
                    </motion.div>

                    {/* Gerbang kanan */}
                    <motion.div
                      initial={{ rotateY: 0 }}
                      animate={opened ? { rotateY: 90 } : { rotateY: 0 }}
                      transition={{ duration: 5, ease: "easeInOut" }}
                      style={{
                        transformOrigin: "right center",
                        willChange: "transform, opacity",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                      }}
                      className="absolute top-1/2 scale-[2.8] -translate-y-1/2 -right-[30vw] w-[40vw] max-w-[300px]"
                    >
                      <Image
                        src="/asset/aset-ornament/gerbang-kanan-putih.webp"
                        width={700}
                        height={700}
                        loading="eager"
                        className="w-full h-auto opacity-90"
                        alt="gerbang kiri"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Burung kerajaan */}
                  <motion.div
                    initial={{ opacity: 0, x: -300 }} // start dari luar kiri
                    animate={
                      opened ? { opacity: 1, x: 100 } : { opacity: 0, x: -300 }
                    }
                    transition={{ duration: 4, ease: "easeInOut", delay: 8 }} // muncul sedikit setelah matahari
                    className="absolute top-32 left-0 z-20"
                  >
                    <Image
                      src="/asset/bird.gif"
                      width={200}
                      height={200}
                      alt="burung"
                      loading="eager"
                      className="rounded-full object-cover opacity-100"
                    />
                  </motion.div>

                  {/* Latar kerajaan */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={
                      opened
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.9 }
                    }
                    transition={{ duration: 2, ease: "easeOut", delay: 3 }} // delay biar nunggu gerbang kelar
                    className="absolute top-0 left-0 right-0 bottom-0  bg-cover  w-full min-h-screen"
                  >
                    <Image
                      src="/asset/aset-ornament/latar-belakang.webp"
                      width={700}
                      height={700}
                      loading="eager"
                      className="h-full w-full opacity-90 object-cover"
                      alt="latar kerajaan"
                    />
                  </motion.div>
                </motion.div>

                {/* Animasi Penutup */}
                <motion.div id="animasi-penutup">
                  {/* pohon kiri */}
                  <motion.div
                    initial={{ x: -100, opacity: 0 }} // awalnya ga keliatan
                    animate={
                      { x: 0, opacity: 1 } // muncul dan geser ketika gerbang terbuka
                    }
                    transition={{
                      duration: 4,
                      ease: "easeInOut",
                      delay: 9,
                    }}
                    className="absolute top-0 left-0 z-20"
                    exit={{
                      opacity: 0,
                      x: -500,
                      transition: { duration: 5, delay: 10 },
                    }}
                  >
                    <Image
                      src="/asset/aset-ornament/pohon-atas-kiri.webp"
                      width={700}
                      height={700}
                      loading="eager"
                      className="h-full w-full opacity-100"
                      alt="bunga"
                    />
                  </motion.div>

                  {/* pohon kanan */}
                  <motion.div
                    initial={{ x: 100, opacity: 0 }} // awalnya ga keliatan
                    animate={
                      { x: 0, opacity: 1 } // muncul dan geser ketika gerbang terbuka
                    }
                    transition={{
                      duration: 4,
                      ease: "easeInOut",
                      delay: 10,
                    }}
                    className="absolute top-0 right-0 z-20"
                    exit={{
                      opacity: 0,
                      x: -500,
                      transition: { duration: 5 },
                    }}
                  >
                    <Image
                      src="/asset/aset-ornament/pohon-atas-kanan.webp"
                      width={700}
                      height={700}
                      loading="eager"
                      className="h-full w-full opacity-90"
                      alt="bunga"
                    />
                  </motion.div>

                  {/* Ornament pohon hitam */}
                  <motion.div
                    initial={{ opacity: 0, x: -300 }} // start dari luar kiri
                    animate={
                      opened
                        ? {
                            opacity: 1,
                            x: 0,
                            rotate: [0, -2, 2, -1, 1, 0], // goyang ke kiri-kanan
                          }
                        : { opacity: 0, x: -300 }
                    }
                    transition={{
                      duration: 4,
                      ease: "easeInOut",
                      delay: 7,
                      rotate: {
                        repeat: Infinity, // ulang terus
                        duration: 8,
                        ease: "easeInOut",
                      },
                    }}
                    className="absolute top-24 -left-0 z-10"
                  >
                    <Image
                      src="/asset/aset-ornament/pohon-hitam.webp"
                      width={300}
                      height={400}
                      alt="ornament kiri"
                      loading="eager"
                      className="object-contain opacity-60"
                    />
                  </motion.div>

                  {/* Bunga Bawah Kiri */}
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      rotate: [0, 1, -1, 0.5, 0], // goyangan pelan
                      y: [0, -2, 2, -1, 0], // naik turun pelan
                    }}
                    transition={{
                      x: { duration: 4, ease: "easeInOut", delay: 4 },
                      opacity: { duration: 4, ease: "easeInOut", delay: 4 },
                      rotate: {
                        repeat: Infinity,
                        duration: 6,
                        ease: "easeInOut",
                        delay: 8,
                      },
                      y: {
                        repeat: Infinity,
                        duration: 6,
                        ease: "easeInOut",
                        delay: 8,
                      },
                    }}
                    className="absolute bottom-0 left-0 z-20"
                  >
                    <Image
                      src="/asset/aset-ornament/bunga-kiri.webp"
                      width={700}
                      height={700}
                      loading="eager"
                      className="h-full w-full opacity-90"
                      alt="bunga"
                    />
                  </motion.div>

                  {/* Bunga Tengah Bawah */}
                  <motion.div
                    initial={{ y: 300, opacity: 0 }} // mulai dari bawah
                    animate={{
                      y: 0, // posisi akhir
                      opacity: 1,
                      rotate: [0, 0.8, -0.8, 0.4, 0], // goyangan pelan
                      y: [0, -1.5, 1.5, -1, 0], // naik turun pelan
                    }}
                    transition={{
                      y: { duration: 4, ease: "easeInOut", delay: 6 },
                      opacity: { duration: 4, ease: "easeInOut", delay: 6 },
                      rotate: {
                        repeat: Infinity,
                        duration: 7,
                        ease: "easeInOut",
                        delay: 10,
                      },
                      y: {
                        repeat: Infinity,
                        duration: 7,
                        ease: "easeInOut",
                        delay: 10,
                      },
                    }}
                    className="absolute bottom-0 left-0 right-0 z-20"
                  >
                    <Image
                      src="/asset/aset-ornament/bunga-tengah.webp"
                      width={700}
                      height={700}
                      loading="eager"
                      className="h-full w-full opacity-90"
                      alt="bunga"
                    />
                  </motion.div>

                  {/* Bunga Bawah Kanan */}
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      rotate: [0, -1, 1, -0.5, 0],
                      y: [0, -2, 2, -1, 0],
                    }}
                    transition={{
                      x: { duration: 4, ease: "easeInOut", delay: 4 },
                      opacity: { duration: 4, ease: "easeInOut", delay: 4 },
                      rotate: {
                        repeat: Infinity,
                        duration: 6,
                        ease: "easeInOut",
                        delay: 8,
                      },
                      y: {
                        repeat: Infinity,
                        duration: 6,
                        ease: "easeInOut",
                        delay: 8,
                      },
                    }}
                    className="absolute bottom-0 right-0 z-20"
                  >
                    <Image
                      src="/asset/aset-ornament/bunga-kanan.webp"
                      width={700}
                      height={700}
                      loading="eager"
                      className="h-full w-full opacity-90"
                      alt="bunga"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Main Menu dengan Background Video */}
            <AnimatePresence>
              <motion.div
                className="absolute z-20 top-0 w-screen overflow-x-hidden h-screen overflow-y-scroll flex flex-col scroll-smooth"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{ perspective: "1200px" }}
              >
                {/* Section 1 */}
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 15 }}
                  viewport={{ once: false, amount: 0.5 }}
                  className="relative flex-shrink-0 w-screen h-screen snap-center flex flex-col gap-5 items-center justify-center text-slate-700 text-shadow-2xs will-change-transform overflow-hidden"
                >
                  {/* 🖼️ Bingkai nama */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      opened
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    transition={{ duration: 2, ease: "easeOut", delay: 1 }} // muncul duluan
                    className="absolute inset-0 w-full h-full z-10"
                  >
                    <Image
                      src="/asset/aset-ornament/bingkai-nama.webp"
                      fill
                      priority
                      className="object-cover w-full h-full"
                      alt="bingkai nama"
                    />
                  </motion.div>

                  {/* ✨ Nama pengantin */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut", delay: 1 }} // delay setelah bingkai selesai
                    className="relative z-20 text-3xl md:text-5xl font-bold drop-shadow-lg flex flex-col items-center gap-2 text-[#7a591c] p-5 rounded-md"
                  >
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.5, delay: 1 }}
                      className={`text-xl mt-10 md:text-2xl text-[#3d2e12] font-bold ${fonts.greatVibes.className}`}
                    >
                      The Wedding Of
                    </motion.h2>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 5, ease: "easeOut", delay: 19 }}
                      className="flex flex-col items-center"
                    >
                      <h2 className={`italic ${fonts.playfair.className}`}>
                        Adam
                      </h2>
                      <span className={`${fonts.playfair.className}`}>&</span>
                      <h2 className={`italic ${fonts.playfair.className}`}>
                        Ria
                      </h2>
                    </motion.div>
                  </motion.div>

                  {/* animasi kecil di bawah */}
                  <motion.div
                    className="absolute bottom-10 right-5 flex items-center gap-2"
                    animate={{ x: [0, 10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  />
                </motion.section>

                {/* Section 2 - QS Ar-Rum */}
                <motion.section
                  initial={{ rotateY: -90, opacity: 0 }}
                  whileInView={{ rotateY: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative flex-shrink-0 w-screen min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F0D5A3] px-6 will-change-transform"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative bg-[#f8f5f0] rounded-xl shadow-lg border border-white/50 p-6 md:p-10 max-w-2xl text-center flex flex-col items-center gap-6 will-change-transform"
                  >
                    {/* Ornamen atas */}
                    <div className="flex justify-center">
                      <div className="absolute -top-32 -left-8 opacity-70">
                        <Image
                          src="/asset/bunga-pembuka-1.png"
                          alt="ornamen atas"
                          width={200}
                          height={200}
                          loading="lazy"
                          decoding="async"
                          className="w-[130px] md:w-52"
                        />
                      </div>
                    </div>

                    {/* Ayat */}
                    <p className="text-base md:text-lg leading-relaxed text-[#5b4636]">
                      “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia
                      menciptakan pasangan-pasangan untukmu dari jenismu
                      sendiri, agar kamu cenderung dan merasa tenteram
                      kepadanya, dan Dia menjadikan di antaramu rasa kasih dan
                      sayang. Sungguh, pada yang demikian itu benar-benar
                      terdapat tanda-tanda (kebesaran Allah) bagi kaum yang
                      berpikir”
                    </p>

                    {/* QS */}
                    <p className="mt-6 text-sm md:text-base font-semibold text-[#5b4636]">
                      (Qs. Ar-Rum : 21)
                    </p>
                  </motion.div>
                </motion.section>

                {/* Section 3 - Mempelai Pria & Wanita */}
                <motion.section className="bg-[#fcfcfc]/80 w-full  text-[#6b4c2a] flex flex-col items-center justify-center">
                  {/* Mempelai Pria */}
                  <div className="flex items-center mt-5 p-10">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }} // dari kanan
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="w-[250px] h-[300px] overflow-hidden rounded-2xl shadow-lg border-2 border-[#ddd] rounded-r-4xl"
                    >
                      <Image
                        src="/aset-foto/mempelai-pria.webp"
                        alt="Mempelai Pria"
                        width={250}
                        height={300}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    <article className="flex flex-col items-center md:items-start pr-3 gap-2 text-center md:text-left">
                      <h1
                        className={`text-4xl ${fonts.leagueScript.className}`}
                      >
                        <b>Adam, S.T</b>
                      </h1>
                      <div
                        className={`text-xs flex flex-col items-center ${fonts.playfair.className}`}
                      >
                        <p>Putra Dari</p>
                        <p>Bapak Ayub</p>
                        <p>&</p>
                        <p>Ibu Ade</p>
                        <a
                          href="https://www.instagram.com/proyekitaa?igsh=aGZ4aTJlczlvODd2"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#7a5c3a] text-white mt-4 shadow-md hover:scale-110 transition"
                        >
                          <Instagram />
                        </a>
                      </div>
                    </article>
                  </div>

                  <motion.span
                    initial={{ opacity: 0, scale: 0 }} // dari kanan
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className="text-6xl "
                  >
                    &
                  </motion.span>

                  {/* Mempelai Wanita */}
                  <div className="flex items-center mt-5 p-10">
                    <article className="flex flex-col items-center md:items-start pr-3 gap-2 text-center md:text-left">
                      <h1
                        className={`text-4xl ${fonts.leagueScript.className}`}
                      >
                        <b>Ria Mariana</b>
                      </h1>
                      <div
                        className={`text-xs flex flex-col items-center ${fonts.playfair.className}`}
                      >
                        <p>Putri Dari</p>
                        <p>Bapak Samuri</p>
                        <p>&</p>
                        <p>Ibu Saodah</p>
                        <a
                          href="https://www.instagram.com/ria_tengker/?igsh=cjc4NXNud3dodmJk&utm_source=qr#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#7a5c3a] text-white mt-4 shadow-md hover:scale-110 transition"
                        >
                          <Instagram />
                        </a>
                      </div>
                    </article>

                    <motion.div
                      initial={{ opacity: 0, x: 50 }} // dari kanan
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="w-[250px] h-[300px] overflow-hidden shadow-lg border-2 border-[#ddd] rounded-l-4xl"
                    >
                      <Image
                        src="/aset-foto/mempelai-wanita.webp"
                        alt="Mempelai Wanita"
                        width={250}
                        height={300}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>
                </motion.section>

                {/* Section 4 - Save The Date & Countdown */}
                <motion.section
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9 }}
                  className="flex-shrink-0 w-full  relative bg-[#e0bb7b] flex flex-col items-center justify-start overflow-hidden"
                >
                  {/* Background Foto Faded */}
                  <div className="absolute inset-0">
                    <img
                      src="/aset-foto/sampul.webp"
                      alt="Couple"
                      loading="lazy"
                      className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-[#f8f5f0]"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center px-6 py-16">
                    {/* Tulisan Save The Date */}
                    <h2
                      className={`text-4xl md:text-5xl font-[GreatVibes] text-[#e0bb7b] text-shadow-2xs mb-6 ${fonts.greatVibes.className}`}
                    >
                      Save The Date
                    </h2>

                    <CountdownAkad />

                    {/* Frame Akad Nikah */}
                    <motion.div
                      id="kalender"
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className={`relative w-full  rounded-2xl flex flex-col items-center gap-5 border-2 border-[#d6c4a3] bg-[url(/asset/latar-akad.webp)] bg-cover h-[700px] p-6 bg-white/80 backdrop-blur-md z-20 shadow-xl ${fonts.playfair.className}`}
                    >
                      <p
                        className={`text-center text-lg md:text-xl mt-20 font-semibold text-[#7a5c3a] mb-2 ${fonts.playfair.className}`}
                      >
                        Akad Nikah
                      </p>

                      <img
                        src="/asset/ornament.png"
                        className="absolute top-0 left-0 w-[120px] h-[120px]"
                      />
                      <motion.img
                        src="/asset/bunga-pembuka-1.png"
                        alt="Bunga Pembuka"
                        className="absolute top-5 right-14 opacity-10 -z-10 w-[250px] h-auto"
                        initial={{ opacity: 0.5 }}
                        loading="lazy"
                        animate={{
                          x: 15, // geser ke kanan max 15px
                          y: 5,
                        }}
                        transition={{
                          duration: 3, // 3 detik bolak-balik, ini udah pas
                          repeat: Infinity,
                          repeatType: "mirror", // bolak balik biar halus
                          ease: "easeInOut", // bikin smooth
                        }}
                      />

                      {/* Bagian tanggal */}
                      <section
                        className={`flex flex-col items-center justify-center ${fonts.playfair.className}`}
                      >
                        <motion.h1
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className={`text-2xl text-[#6b4b3e] mb-4 ${fonts.playfair.className}`}
                        >
                          Kamis
                        </motion.h1>

                        <div
                          ref={tanggalRef}
                          className={`text-center text-sm md:text-base text-[#5b4636] leading-relaxed ${fonts.playfair.className}`}
                        >
                          <motion.p
                            key={tanggal} // biar animasi jalan tiap update
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`text-7xl font-bold text-[#6b4b3e] ${fonts.poppins.className}`}
                          >
                            23
                          </motion.p>
                          Oktober 2025 <br />
                          Pukul 08.00 WIB <br />
                          Kp.Talaga rt 002 rw 001 Desa.Karyalaksana Kec.Ibun
                          Kab.Bandung
                        </div>
                      </section>

                      <button
                        onClick={() =>
                          window.open(
                            "https://maps.app.goo.gl/zuhA7tFTYX1UJ6JJA?g_st=iw",
                            "_blank"
                          )
                        }
                        className="flex items-center bg-[#5b4636] text-sm px-4 text-white rounded-md py-2 hover:bg-[#7a5c3a] transition-all duration-300 shadow-md"
                      >
                        <MapPin />
                        Lokasi Acara
                      </button>
                    </motion.div>

                    {/* Resepsi pernikahan */}
                    <motion.div
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.9 }}
                      ref={tanggalRef}
                      className="relative w-full max-w-2xl mt-10 rounded-2xl flex flex-col items-center gap-5 border-2 border-[#d6c4a3] bg-[url(/asset/latar-akad.webp)] bg-cover h-[700px] p-6 bg-white/80 backdrop-blur-md z-20 shadow-xl"
                    >
                      <p className="text-center text-lg md:text-xl mt-20 font-semibold text-[#7a5c3a] mb-2">
                        Resepsi Pernikahan
                      </p>

                      <img
                        src="/asset/ornament.png"
                        className="absolute top-0 left-0 w-[120px] h-[120px]"
                        loading="lazy"
                      />
                      <motion.img
                        src="/asset/bunga-pembuka-1.png"
                        alt="Bunga Pembuka"
                        loading="lazy"
                        className="absolute top-5 right-14 opacity-10 -z-10 w-[250px] h-auto"
                        initial={{ opacity: 0.5 }}
                        animate={{
                          x: 15, // geser ke kanan max 15px
                          y: 5,
                        }}
                        transition={{
                          duration: 3, // 3 detik bolak-balik, ini udah pas
                          repeat: Infinity,
                          repeatType: "mirror", // bolak balik biar halus
                          ease: "easeInOut", // bikin smooth
                        }}
                      />

                      {/* Bagian tanggal */}
                      <section className="flex flex-col items-center justify-center">
                        <motion.h1
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className={`text-xl font-[GreatVibes] text-[#6b4b3e] mb-4 ${fonts.playfair.className}`}
                        >
                          Minggu
                        </motion.h1>

                        <div
                          className={`text-center text-sm md:text-base text-[#5b4636] leading-relaxed ${fonts.playfair.className}`}
                        >
                          <motion.p
                            key={tanggal}
                            initial={{ scale: 0.8, opacity: 1 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 1 }}
                            className={`text-7xl font-bold text-[#6b4b3e] ${fonts.poppins.className}`}
                          >
                            26
                          </motion.p>
                          Oktober 2025 <br />
                          Pukul 10.00 WIB <br />
                          Kp.Talaga rt 002 rw 001 Desa.Karyalaksana Kec.Ibun
                          Kab.Bandung
                        </div>
                      </section>

                      <button
                        onClick={() =>
                          window.open(
                            "https://maps.app.goo.gl/zuhA7tFTYX1UJ6JJA?g_st=iw",
                            "_blank"
                          )
                        }
                        className="flex items-center bg-[#5b4636] text-sm px-4 text-white rounded-md py-2 hover:bg-[#7a5c3a] transition-all duration-300 shadow-md"
                      >
                        <MapPin />
                        Lokasi Acara
                      </button>
                    </motion.div>
                  </div>
                </motion.section>

                {/* Section 5 - Love Story */}
                <motion.section
                  id="love"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="flex-shrink-0 w-[90%] bg-[url(/asset/aset-ornament/latar-belakang.webp)] mx-auto min-h-screen snap-center relative bg-[#fdfaf5]/85 flex flex-col items-center justify-start px-6 py-16 overflow-hidden shadow-md rounded-t-[80px] mb-10"
                >
                  {/* Background Ornamen Atas */}
                  <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#f3ecd0]/40 to-transparent pointer-events-none"></div>

                  {/* Judul */}
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className={`text-5xl md:text-5xl font-[GreatVibes] text-[#7a5c3a] mb-8 ${fonts.greatVibes.className}`}
                  >
                    Love Story
                  </motion.h2>

                  {/* Foto Couple */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="relative mb-10"
                  >
                    <div className="rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                      <img
                        src="/aset-foto/slide4.webp"
                        alt="Love Story"
                        loading="lazy"
                        className="w-[300px] md:w-[480px] h-[230px] object-cover"
                      />
                    </div>
                  </motion.div>

                  {/* Awal Perkenalan */}
                  <motion.div
                    initial={{ opacity: 0, x: 300 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full sm:w-[90%] md:w-[700px] min-h-[350px] sm:min-h-[380px] md:min-h-[400px] rounded-l-[80px] overflow-hidden shadow-lg flex items-center justify-center mx-auto"
                  >
                    {/* Background Gambar */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: "url('/aset-foto/slide3.webp')",
                      }}
                    ></div>

                    {/* Overlay transparan */}
                    <div className="absolute inset-0 bg-black/30"></div>

                    {/* Konten Teks */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 py-8 sm:py-10">
                      <motion.h3
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className={`text-3xl sm:text-4xl md:text-5xl font-serif text-white drop-shadow-md mb-4 ${fonts.greatVibes.className}`}
                      >
                        Awal Perkenalan
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className={`max-w-full sm:max-w-[85%] md:max-w-2xl text-sm sm:text-base md:text-lg font-serif text-white leading-relaxed drop-shadow-md ${fonts.playfair.className}`}
                      >
                        Tidak ada yang kebetulan di dunia ini, semua sudah
                        tersusun rapi oleh yang maha kuasa. Kita tidak bisa
                        memilih kepada siapa kita akan jatuh cinta. Kami awal
                        kenal pada awal tahun 2023 di salah satu sosial media
                        yaitu Instagram, lalu melakukan pertemuan pertama pada
                        bulan April tahun 2023. Tidak ada yang pernah menyangka
                        bahwa pertemuan itu membawa kami pada suatu ikatan.
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Lamaran */}
                  <motion.div
                    initial={{ opacity: 0, x: -300 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full sm:w-[90%] md:w-[700px] mt-8 sm:mt-10 h-[300px] sm:h-[320px] md:h-[350px] rounded-r-[200px] overflow-hidden shadow-lg mx-auto"
                  >
                    {/* Background Gambar */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: "url('/aset-foto/slide2.webp')",
                      }}
                    ></div>

                    {/* Overlay transparan */}
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* Konten Teks */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 md:px-10 text-center">
                      <motion.h3
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className={`text-3xl sm:text-4xl md:text-5xl font-serif text-white drop-shadow-md mb-4 ${fonts.greatVibes.className}`}
                      >
                        Lamaran
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className={`max-w-full sm:max-w-2xl text-sm sm:text-base md:text-lg font-serif text-white leading-relaxed ${fonts.playfair.className}`}
                      >
                        Atas kehendakNya kami melangkah ke tahap yang lebih
                        serius dengan melangsungkan lamaran yaitu pada 31
                        Agustus 2024.
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Pernikahan */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9 }}
                    className="relative w-full sm:w-[90%] md:w-[700px] mt-8 sm:mt-10 h-[300px] sm:h-[320px] md:h-[350px] rounded-md overflow-hidden shadow-lg mx-auto"
                  >
                    {/* Background Gambar */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: "url('/aset-foto/slide1.webp')",
                      }}
                    ></div>

                    {/* Overlay transparan */}
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* Konten Teks */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 md:px-10 text-center">
                      <motion.h3
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className={`text-3xl sm:text-4xl md:text-5xl font-serif text-white drop-shadow-md mb-4 ${fonts.greatVibes.className}`}
                      >
                        Pernikahan
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className={`max-w-full sm:max-w-2xl text-sm sm:text-base md:text-lg font-serif text-white leading-relaxed ${fonts.playfair.className}`}
                      >
                        ”Percayalah, bukan karna bertemu lalu berjodoh tapi
                        karna berjodohlah kami dipertemukan, kami memutuskan
                        untuk mengikrarkan janji suci pernikahan kami insya
                        Allah tanggal 23 Oktober 2025. Sebagaimana yang
                        dikatakan oleh Sayidina Ali bin Abi Thalib “Apa yang
                        akan menjadi takdirmu akan menemukan jalannya untuk
                        menemukanmu”
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Background Ornamen Bawah */}
                  <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#f3ecd0]/40 to-transparent pointer-events-none"></div>
                </motion.section>
                {/* section 6 - Galeri */}
                <motion.section
                  id="galeri"
                  className="flex-shrink-0 w-screen min-h-screen snap-center bg-[#fdfaf5] flex flex-col items-center justify-start gap-10 px-6 py-16 overflow-hidden"
                >
                  <GaleriPlatinum1 />
                  {/* 💞 Galeri Cinta */}
                  <section className="relative w-full flex flex-col items-center overflow-hidden">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl">
                      {[
                        "/aset-foto/slide1.webp",
                        "/aset-foto/slide2.webp",
                        "/aset-foto/slide3.webp",
                        "/aset-foto/slide4.webp",
                      ].map((src, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 1.2,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                          whileHover={{ scale: 1.05 }}
                          className="relative overflow-hidden rounded-2xl shadow-lg group"
                        >
                          {/* Efek gambar */}
                          <motion.img
                            src={src}
                            alt={`Prewed ${i + 1}`}
                            loading="lazy"
                            className="w-full h-[180px] md:h-[260px] lg:h-[300px] object-cover transform transition-transform duration-700 group-hover:scale-110"
                          />

                          {/* Overlay efek cinta */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end justify-center">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 1.2, delay: i * 0.1 }}
                              className="mb-4 text-white text-sm font-light tracking-wide"
                            >
                              <span className="flex items-center gap-2">
                                ❤️ Momen {i + 1}
                              </span>
                            </motion.div>
                          </div>

                          {/* Efek floating lembut */}
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              duration: 5 + i,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute inset-0"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </motion.section>
                {/* Section 7 - Wedding gift */}
                <WeddingGift />
                {/* section 8 - Form RSVP */}
                <section
                  id="rsvp"
                  className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-[url('/asset/latar-akad.webp')] bg-cover bg-center"
                >
                  {/* Overlay */}{" "}
                  <div className="absolute inset-0 bg-[#f9f4ef]/80 backdrop-blur-sm z-0" />
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    viewport={{ once: true }}
                    className="relative z-10 w-full max-w-lg rounded-2xl border border-[#b89c7c] bg-[#f9f4ef]/95 shadow-xl p-8"
                  >
                    {/* Judul */}
                    <h2
                      className={`text-4xl ${fonts.greatVibes.className} text-[#6b4b3e] text-center mb-6`}
                    >
                      RSVP
                    </h2>
                    <p
                      className={`text-center text-gray-700 mb-8 ${fonts.playfair.className}`}
                    >
                      Mohon konfirmasi kehadiran Anda pada acara pernikahan
                      kami.
                    </p>

                    {/* kehadiran */}
                    <div className="flex gap-5 justify-center mb-5">
                      <div className="p-5 w-[200px] text-center bg-teal-400 rounded-md text-white">
                        <span>{pesertaHadir.length}</span>
                        <p>Hadir</p>
                      </div>
                      <div className="p-5 bg-rose-400 rounded-md w-[200px] text-center text-white">
                        <span>{pesertaTidakHadir.length}</span>
                        <p>Tidak Hadir</p>
                      </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      {/* Nama */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          name="nama_lengkap"
                          onChange={handleChange}
                          value={FormData.nama_lengkap}
                          placeholder="Masukkan nama lengkap"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#b89c7c] focus:outline-none"
                          required
                        />
                      </div>

                      {/* Kehadiran */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Konfirmasi Kehadiran
                        </label>
                        <select
                          name="konfirmasi_kehadiran"
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#b89c7c] focus:outline-none"
                        >
                          <option value="">---pilih kehadiran---</option>
                          <option value="hadir">Hadir</option>
                          <option value="tidak hadir">Tidak Bisa Hadir</option>
                        </select>
                      </div>

                      {/* Pesan */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pesan / Ucapan
                        </label>
                        <textarea
                          rows="4"
                          name="ucapan"
                          value={formData.ucapan}
                          onChange={handleChange}
                          placeholder="Tulis ucapan atau doa..."
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#b89c7c] focus:outline-none"
                        ></textarea>
                      </div>

                      {/* Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#b89c7c] text-white py-3 rounded-full shadow-md hover:bg-[#9e8368] transition flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                      </motion.button>
                    </form>
                  </motion.div>
                </section>

                {/* Daftar Komentar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="relative z-10 w-full max-w-3xl mx-auto p-6 mt-12 space-y-6  rounded-3xl shadow-2xl"
                >
                  {ucapanPesertaHadir.length > 0 && (
                    <h3 className="text-3xl md:text-4xl font-[cursive] rounded-xl bg-white p-3 text-[#6b4b3e] text-center mb-6">
                      Ucapan & Konfirmasi
                    </h3>
                  )}

                  {/* List Komentar */}
                  <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-[#b89c7c]/50 scrollbar-track-transparent">
                    {currentComments.map((c, index) => (
                      <motion.div
                        key={c.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row gap-4 p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-[#d6c3ab]/40"
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#d9b89c] flex items-center justify-center text-white font-bold text-lg sm:text-xl uppercase">
                            {c.nama_lengkap?.charAt(0) || "U"}
                          </div>
                        </div>

                        {/* Konten komentar */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                            <div className="flex flex-col">
                              <h4 className="font-semibold text-[#6b4b3e] text-lg sm:text-xl">
                                {c.nama_lengkap}
                              </h4>
                              {c.createdAt && (
                                <span className="text-gray-400 text-xs sm:text-sm mt-0.5">
                                  {new Date(
                                    c.createdAt.seconds
                                      ? c.createdAt.seconds * 1000
                                      : c.createdAt
                                  ).toLocaleString("id-ID", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              )}
                            </div>
                            <span
                              className={`mt-1 sm:mt-0 text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                                c.konfirmasi_kehadiran === "hadir"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {c.konfirmasi_kehadiran === "hadir"
                                ? "Hadir"
                                : "Tidak Hadir"}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm sm:text-base italic leading-relaxed">
                            "{c.ucapan}"
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-[#7a5c3a] text-white disabled:opacity-50 hover:bg-[#9a7550] transition-colors"
                      >
                        Prev
                      </button>

                      <span className="px-4 py-2 text-[#6b4b3e] font-medium text-sm sm:text-base">
                        {currentPage} / {totalPages}
                      </span>

                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-[#7a5c3a] text-white disabled:opacity-50 hover:bg-[#9a7550] transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </motion.div>

                {/* penutup */}
                <motion.section className="mt-12 relative bg-[url(/asset/latar-akad.webp)] bg-cover ">
                  <div className="w-full h-full bg-white/40 opacity-60 absolute"></div>

                  <div
                    ref={tanggalRef}
                    className="relative w-full max-w-2xl flex flex-col items-center gap-5 border-2 border-[#d6c4a3]  h-[700px] p-6  shadow-xl"
                  >
                    <motion.img
                      src="/aset-foto/sampul.webp"
                      loading="lazy"
                      alt="Bunga Pembuka"
                      className=" w-[200px] mt-16 border-4 border-[#a38751]  h-[270px] object-cover rounded-4xl"
                    />
                  </div>

                  <article className="text black flex flex-col gap-5 absolute bottom-[6rem] px-10 text-center w-full left-1/2 -translate-x-1/2">
                    <motion.p
                      initial={{ opacity: 0, y: 120 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      className={`text-sm ${fonts.poppins.className}`}
                    >
                      Merupakan suatu kehormatan dan kebahagiaan bagi kami,
                      apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan
                      doa restu. Atas kehadiran dan doa restunya, kami
                      mengucapkan terima kasih.
                    </motion.p>
                    <motion.span
                      initial={{ opacity: 0, y: 120 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      className={`text-sm ${fonts.playfair.className}`}
                    >
                      Kami yang berbahagia,
                    </motion.span>
                    <motion.h2
                      initial={{ opacity: 0, y: 120 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1 }}
                      className={`font-bold text-4xl ${fonts.greatVibes.className}`}
                    >
                      Adam & Ria
                    </motion.h2>
                  </article>
                </motion.section>
              </motion.div>
            </AnimatePresence>

            {/* Musik */}
            <audio ref={audioRef} loop>
              <source src="/backsound.mp3" type="audio/mpeg" />
            </audio>

            {/* Tombol Musik */}
            <button
              onClick={toggleMusic}
              className="absolute bottom-5 right-5 z-50 bg-white/80 p-3 rounded-full shadow-lg hover:scale-110 transition"
            >
              {isPlaying ? (
                <Volume2 className="w-6 h-6 text-amber-800" />
              ) : (
                <VolumeX className="w-6 h-6 text-amber-800" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OurJourneyContent;
