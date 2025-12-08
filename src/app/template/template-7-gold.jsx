"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlayCircle, PauseCircle } from "lucide-react";
import CountdownSection from "@/components/paket/gold/Countdown";
import { Swiper, SwiperSlide } from "swiper/react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/libs/config";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useSearchParams } from "next/navigation";

// Dummy Messages
const messages = [
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

// Tema Hitam Putih Vintage
const THEMES = {
  vintage: {
    name: "Black & White Vintage",
    pageBg:
      "bg-[radial-gradient(circle_at_center,_#f8f8f8_0%,_#eaeaea_100%)] text-gray-800",
    headerGrad: "bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500",
    card: "bg-gradient-to-br from-[#fafafa] via-[#f3f3f3] to-[#e9e9e9]",
    border: "border-gray-400",
    textMain: "text-gray-900",
    cta: "bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-500",
    chip: "bg-gray-200 text-gray-700",
  },
};

export default function Template7Gold({ id, data }) {
  const rsvpRef = useRef(null);
  const audioRef = useRef(null);
  const [opened, setOpened] = useState(false);
  const searchParams = useSearchParams();
  const namaTamu = searchParams.get("to");
  const [dataMempelai, setDataMempelai] = useState(data || null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [formData, setFormData] = useState({ nama: "", kehadiran: "" });
  const images = [
    "/foto-dummy/slider1.avif",
    "/foto-dummy/slider2.jpeg",
    "/foto-dummy/slider3.avif",
    "/foto-dummy/slider4.jpg",
  ];
  const theme = "vintage";
  const T = THEMES[theme];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ambil data berdasarkan email atau template
        const q = query(
          collection(db, "pembelian"),
          where("template", "==", "Gold 7"),
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

  return (
    <main
      className={`min-h-screen ${T.pageBg} relative overflow-hidden`}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {/* HALAMAN PEMBUKA */}
      {!opened && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-6"
        >
          {/* Ornamen kiri atas */}
          <img
            src="/asset/gold/template-7/bunga-hitam.png"
            alt="Flower Top Left"
            className="absolute top-0 left-0 w-40 opacity-90"
          />

          <p className="text-gray-500 uppercase tracking-widest mb-6">
            Our Journey
          </p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full border border-gray-300 relative z-10"
          >
            <p className="text-gray-500 text-sm">Dear</p>
            <p className="font-bold text-gray-800 mb-4">
              {namaTamu || "Nama Tamu"}
            </p>
            <p className="italic text-gray-600 mb-2">The wedding of</p>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">
              {dataMempelai?.panggilanPria || "Putra"} &{" "}
              {dataMempelai?.panggilanWanita || "Putri"}
            </h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="bg-gray-900 text-white px-6 py-3 rounded-md font-semibold shadow-md mx-auto"
            >
              Open the Invitation
            </motion.button>
          </motion.div>
        </motion.section>
      )}

      {/* UNDANGAN */}
      {opened && (
        <div className="relative z-10">
          {/* Musik */}
          <audio
            ref={audioRef}
            autoPlay
            loop
            src={dataMempelai?.backsound || "/bg-wedding.mp3"}
            className="hidden"
          />
          <button
            onClick={toggleAudio}
            className={`fixed z-40 bottom-4 right-4 p-3 rounded-full shadow-lg ${T.cta} text-white`}
          >
            {isPlaying ? <PauseCircle size={28} /> : <PlayCircle size={28} />}
          </button>

          {/* Bagian Hero */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative flex flex-col items-center justify-center text-center bg-[#f8f8f8] min-h-screen px-6 overflow-hidden"
          >
            {/* Ornamen bunga kanan atas dengan animasi lembut */}
            <motion.img
              src="/asset/gold/template-7/ornament-bunga.png"
              alt="Flower Decoration"
              className="absolute top-0 right-0 w-40 md:w-48 opacity-90 pointer-events-none select-none"
              initial={{ y: 0, rotate: 0 }}
              animate={{
                y: [0, -10, 0, 10, 0], // naik turun perlahan
                rotate: [0, 2, 0, -2, 0], // sedikit goyang kiri kanan
              }}
              transition={{
                duration: 12, // total waktu animasi (semakin besar semakin lambat)
                repeat: Infinity, // looping terus
                ease: "easeInOut",
              }}
            />

            {/* Nama */}
            <div className="mt-20 mb-8 z-10">
              <h1 className="text-5xl font-serif text-gray-900 leading-tight">
                {dataMempelai?.panggilanPria || "Putra"}
              </h1>
              <p className="text-3xl font-serif text-gray-700">&</p>
              <h1 className="text-5xl font-serif text-gray-900">
                {dataMempelai?.panggilanWanita || "Putri"}
              </h1>
            </div>

            {/* Foto */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="overflow-hidden w-full max-w-md"
            >
              <img
                src={
                  dataMempelai?.fotoSampul[0] ||
                  dataMempelai?.fotoSampul[1] ||
                  "/foto-dummy/latar.jpg"
                }
                alt={`${dataMempelai?.panggilanPria} dan ${dataMempelai?.panggilanWanita}`}
                className="w-[400px] h-[400px] rounded-2xl object-contain grayscale"
              />
            </motion.div>

            {/* Garis */}
            <div className="w-12 border-b border-gray-500 my-8"></div>

            {/* Kutipan */}
            <p className="text-gray-700 text-sm max-w-md italic leading-relaxed">
              "And among the signs of Allah is that Allah created for you mates
              from among yourselves that you may find tranquility in them; and
              He placed between you affection and mercy."
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="pt-8"
          >
            <CountdownSection
              date={dataMempelai?.countdownDate}
              waktu={dataMempelai?.countdownTime}
            />
          </motion.div>

          {/* Mempelai pria dan wanita (vintage hitam putih) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative flex flex-col md:flex-row items-center justify-center gap-12 py-16 bg-[#f7f7f5] overflow-hidden"
          >
            {/* Ornamen background lembut */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-200 opacity-70"></div>

            {/* Foto + Nama Pria */}
            <div className="flex flex-col items-center z-10">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="relative overflow-hidden rounded-2xl shadow-xl grayscale hover:grayscale-0 transition-all duration-700 border border-gray-300"
              >
                <img
                  src={
                    dataMempelai?.fotoMempelaiPria[0] || "/foto-dummy/pria.png"
                  }
                  alt="Mempelai Pria"
                  className="w-64 h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
              </motion.div>

              {/* Nama & Orang Tua */}
              <div className="mt-4 bg-white rounded-xl shadow-md p-4 text-center w-64">
                <p className="text-lg font-serif font-semibold text-gray-800">
                  {dataMempelai?.namaLengkapPria || "Nama Pria"}
                </p>
                <p className="text-sm text-gray-600">
                  Putra dari{" "}
                  {dataMempelai?.ayahMempelaiPria || "Nama Orang Tua Pria"}
                </p>
              </div>
            </div>

            {/* Simbol hati / pembatas */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="z-10 flex flex-col items-center"
            >
              <div className="w-px h-16 bg-gray-400 mb-4"></div>
              <p className="text-gray-600 font-serif text-lg italic">&</p>
              <div className="w-px h-16 bg-gray-400 mt-4"></div>
            </motion.div>

            {/* Foto + Nama Wanita */}
            <div className="flex flex-col items-center z-10">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="relative overflow-hidden rounded-2xl shadow-xl grayscale hover:grayscale-0 transition-all duration-700 border border-gray-300"
              >
                <img
                  src={
                    dataMempelai?.fotoMempelaiWanita[0] ||
                    "/foto-dummy/wanita.png"
                  }
                  alt="Mempelai Wanita"
                  className="w-64 h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
              </motion.div>

              {/* Nama & Orang Tua */}
              <div className="mt-4 bg-white rounded-xl shadow-md p-4 text-center w-64">
                <p className="text-lg font-serif font-semibold text-gray-800">
                  {dataMempelai?.namaLengkapWanita || "Nama Wanita"}
                </p>
                <p className="text-sm text-gray-600">
                  Putri dari{" "}
                  {dataMempelai?.ayahMempelaiWanita || "Nama Orang Tua Wanita"}
                </p>
              </div>
            </div>

            {/* Grain effect */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.08]"></div>
          </motion.div>

          {/* Love Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative py-20 bg-[#fafafa] overflow-hidden mx-5"
          >
            {/* Ornamen bunga halus di background */}
            <img
              src="/asset/gold/template-7/ornament-bunga.png"
              alt="Bunga Background"
              className="absolute top-0 left-0 w-52 opacity-10"
            />
            <img
              src="/asset/gold/template-7/ornament-bunga.png"
              alt="Bunga Background"
              className="absolute bottom-0 right-0 w-52 opacity-10 rotate-180"
            />

            {/* Judul Section */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-gray-800 text-center mb-12"
            >
              Our Love Story
            </motion.h2>

            {/* Timeline */}
            <div className="relative max-w-4xl mx-auto">
              {/* Garis vertikal */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gray-300"></div>
              {dataMempelai?.loveStory.length > 0
                ? dataMempelai?.loveStory.map((story, index) => {
                    const isLeft = index % 2 === 0; // untuk alternating side
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className={`mb-16 flex flex-col md:flex-row items-center justify-start relative ${
                          isLeft ? "md:justify-end" : ""
                        }`}
                      >
                        <div
                          className={`bg-white border border-gray-200 shadow-md rounded-2xl p-6 max-w-sm ${
                            isLeft ? "md:mr-8" : "md:ml-8"
                          }`}
                        >
                          <h3 className="text-xl font-semibold font-serif text-gray-800 mb-2">
                            {story.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {story.text}
                          </p>
                          <p className="text-xs text-gray-500 mt-2 italic">
                            {story.when}
                          </p>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 bg-gray-600 w-4 h-4 rounded-full border-4 border-white"></div>
                      </motion.div>
                    );
                  })
                : [
                    {
                      title: "First Meet",
                      text: "It all started with a simple hello...",
                      when: "2018",
                    },
                    {
                      title: "The Journey",
                      text: "Through time, they grew together...",
                      when: "2020",
                    },
                    {
                      title: "The Proposal",
                      text: "And finally, love turned into a promise...",
                      when: "2024",
                    },
                  ].map((story, index) => {
                    const isLeft = index % 2 === 0; // untuk alternating side
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className={`mb-16 flex flex-col md:flex-row items-center justify-start relative ${
                          isLeft ? "md:justify-end" : ""
                        }`}
                      >
                        <div
                          className={`bg-white border border-gray-200 shadow-md rounded-2xl p-6 max-w-sm ${
                            isLeft ? "md:mr-8" : "md:ml-8"
                          }`}
                        >
                          <h3 className="text-xl font-semibold font-serif text-gray-800 mb-2">
                            {story.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {story.text}
                          </p>
                          <p className="text-xs text-gray-500 mt-2 italic">
                            {story.when}
                          </p>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 bg-gray-600 w-4 h-4 rounded-full border-4 border-white"></div>
                      </motion.div>
                    );
                  })}
            </div>
          </motion.div>

          {/* Galeri */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="py-10 px-4 md:px-6"
          >
            <h3 className="text-center font-bold text-lg md:text-xl mb-6 text-gray-900">
              Galeri Foto
            </h3>

            {/* Slider */}
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              loop
              spaceBetween={10}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="mb-8"
            >
              {dataMempelai?.gallery.length > 0
                ? dataMempelai?.gallery.map((src, i) => (
                    <SwiperSlide key={i}>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, scale: 0.6 },
                          visible: { opacity: 1, scale: 1 },
                        }}
                        transition={{ duration: 0.8 }}
                      >
                        <Image
                          src={src}
                          width={400}
                          height={400}
                          alt={`Galeri ${i + 1}`}
                          className="rounded-xl border border-gray-400 object-cover w-full h-40 sm:h-44 md:h-48 shadow grayscale"
                        />
                      </motion.div>
                    </SwiperSlide>
                  ))
                : images.map((src, i) => (
                    <SwiperSlide key={i}>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, scale: 0.6 },
                          visible: { opacity: 1, scale: 1 },
                        }}
                        transition={{ duration: 0.8 }}
                      >
                        <Image
                          src={src}
                          width={400}
                          height={400}
                          alt={`Galeri ${i + 1}`}
                          className="rounded-xl border border-gray-400 object-cover w-full h-40 sm:h-44 md:h-48 shadow grayscale"
                        />
                      </motion.div>
                    </SwiperSlide>
                  ))}
            </Swiper>

            {/* Grid dibawah slider (optional) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
              {dataMempelai?.gallery.length > 0
                ? dataMempelai?.gallery.map((src, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { opacity: 0, scale: 0.6 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                      transition={{ duration: 0.8 }}
                    >
                      <Image
                        src={src}
                        width={400}
                        height={400}
                        alt={`Galeri ${i + 1}`}
                        className="rounded-xl border border-gray-400 object-cover w-full h-40 sm:h-44 md:h-48 shadow grayscale"
                      />
                    </motion.div>
                  ))
                : images.map((src, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { opacity: 0, scale: 0.6 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                      transition={{ duration: 0.8 }}
                    >
                      <Image
                        src={src}
                        width={400}
                        height={400}
                        alt={`Galeri ${i + 1}`}
                        className="rounded-xl border border-gray-400 object-cover w-full h-40 sm:h-44 md:h-48 shadow grayscale"
                      />
                    </motion.div>
                  ))}
            </div>
          </motion.section>

          {/* Akad & Resepsi */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="py-20 px-6 bg-[#f7f7f5] text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-gray-800">
              Akad & Resepsi
            </h2>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-2">Akad Nikah</h3>
                <p className="text-gray-600">
                  {dataMempelai?.tanggalAkad || "25 November 2025"},{" "}
                  {dataMempelai?.jamAkad || "08:00"} WIB
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Masjid Al-Falah, Jakarta
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-2">Resepsi</h3>
                <p className="text-gray-600">
                  {dataMempelai?.tanggalResepsi || "25 November 2025"},{" "}
                  {dataMempelai?.jamResepsi || "11:00"}
                  WIB
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {dataMempelai?.lokasiAkad || "Gedung Serbaguna, Jakarta"}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Lokasi */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="py-20 px-6 bg-white text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-gray-800">
              Lokasi
            </h2>
            <div className="max-w-4xl mx-auto">
              <iframe
                src={
                  dataMempelai?.linkMaps ||
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.123456!2d106.822!3d-6.174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMasjid%20Al-Falah!5e0!3m2!1sid!2sid!4v1699612345678!5m2!1sid!2sid"
                }
                className="w-full h-80 rounded-2xl shadow-md"
                loading="lazy"
              ></iframe>
            </div>
          </motion.section>

          {/* Ucapan & Doa RSVP */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="py-20 px-6 bg-[#f7f7f5] text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-gray-800">
              Ucapan & Doa
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Terima kasih atas ucapannya 🙏");
              }}
              className="max-w-md mx-auto flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Nama"
                required
                className="px-4 py-2 rounded-xl border border-gray-300"
              />
              <select
                required
                className="px-4 py-2 rounded-xl border border-gray-300"
              >
                <option value="">Kehadiran</option>
                <option value="Hadir">Hadir</option>
                <option value="Tidak Hadir">Tidak Hadir</option>
              </select>
              <textarea
                placeholder="Ucapan / Doa"
                required
                className="px-4 py-2 rounded-xl border border-gray-300"
              />
              <button className="bg-gray-900 text-white px-6 py-2 rounded-xl font-semibold">
                Kirim
              </button>
            </form>
          </motion.section>

          {/* Daftar Hadir & Komentar */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="py-20 px-6 bg-white text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-gray-800">
              Daftar Hadir
            </h2>

            <div className="max-w-3xl mx-auto">
              <ul className="space-y-4">
                {messages.map((msg, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-100 p-4 rounded-2xl shadow-sm text-left"
                  >
                    <p className="font-semibold">{msg.name}</p>
                    <p className="text-gray-500 text-xs">{msg.time}</p>
                    <p className="mt-2 text-gray-700">{msg.message}</p>
                  </li>
                ))}
              </ul>

              {/* Pagination dummy */}
              <div className="mt-6 flex justify-center gap-2">
                <button className="px-3 py-1 rounded border border-gray-400">
                  1
                </button>
                <button className="px-3 py-1 rounded border border-gray-400">
                  2
                </button>
                <button className="px-3 py-1 rounded border border-gray-400">
                  3
                </button>
              </div>
            </div>
          </motion.section>

          {/* Amplop / Rekening */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="py-20 px-6 bg-[#f7f7f5] text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-gray-800">
              Amplop / Rekening
            </h2>

            <div className="flex flex-col gap-6 max-w-md mx-auto">
              {dataMempelai?.rekening?.length > 0 ? (
                dataMempelai.rekening.map((rek, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-md p-6 text-left"
                  >
                    <p className="text-gray-700 mb-2">
                      Nama: {dataMempelai?.namaLengkapPria} &{" "}
                      {dataMempelai?.namaLengkapWanita}
                    </p>
                    <p className="text-gray-700 mb-2">
                      Bank: {rek.bank || "BCA"}
                    </p>
                    <p className="text-gray-700 mb-2">
                      No. Rekening: {rek.nomor || "123-456-7890"}
                    </p>
                    <p className="text-gray-700 mb-2">
                      Atas Nama: {rek.nama || dataMempelai?.namaLengkapPria}
                    </p>
                    <button
                      className="mt-3 px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      onClick={() => navigator.clipboard.writeText(rek.nomor)}
                    >
                      Salin Nomor
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                      Terima kasih atas doa dan kehadirannya 🙏
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <p className="text-gray-700 mb-2">
                    Nama: {dataMempelai?.namaLengkapPria} &{" "}
                    {dataMempelai?.namaLengkapWanita}
                  </p>
                  <p className="text-gray-700 mb-2">
                    Bank: {dataMempelai?.jenisRekening || "BCA"}
                  </p>
                  <p className="text-gray-700 mb-2">
                    No. Rekening:{" "}
                    {dataMempelai?.nomorRekening || "123-456-7890"}
                  </p>
                  <p className="text-gray-700 mb-2">
                    Atas Nama: {dataMempelai?.namaLengkapPria}
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    Terima kasih atas doa dan kehadirannya 🙏
                  </p>
                </div>
              )}
            </div>
          </motion.section>

          {/* Penutup */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="py-20 px-6 bg-white text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-800">
              Terima Kasih
            </h2>
            <p className="text-gray-700 max-w-xl mx-auto">
              Atas kehadiran, doa, dan ucapan Anda semua. Semoga kita selalu
              diberkati dan diberikan kebahagiaan dalam setiap langkah hidup.
            </p>
          </motion.section>
        </div>
      )}
    </main>
  );
}
