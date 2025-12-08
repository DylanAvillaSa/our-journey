"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlayCircle, PauseCircle } from "lucide-react";
import CountdownSection from "@/components/paket/gold/Countdown";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/libs/config";
import { Swiper, SwiperSlide } from "swiper/react";
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

// Tema Hijau Army
const THEMES = {
  army: {
    name: "Army Green",
    pageBg:
      "bg-[radial-gradient(circle_at_center,_#e6f0e6_0%,_#cce0cc_100%)] text-green-900",
    headerGrad: "bg-gradient-to-r from-green-900 via-green-700 to-green-500",
    card: "bg-gradient-to-br from-[#e6f0e6] via-[#d1e0d1] to-[#c0d0c0]",
    border: "border-green-700",
    textMain: "text-green-900",
    cta: "bg-gradient-to-r from-green-900 via-green-700 to-green-600 hover:from-green-800 hover:to-green-500",
    chip: "bg-green-200 text-green-800",
  },
};

export default function Template8Army({ id, data }) {
  const rsvpRef = useRef(null);
  const audioRef = useRef(null);
  const searchParams = useSearchParams();
  const namaTamu = searchParams.get("to");
  const [dataMempelai, setDataMempelai] = useState(data || null);
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [formData, setFormData] = useState({ nama: "", kehadiran: "" });
  const images = [...Array(12)].map((_, i) => `/images/galeri/${i + 1}.jpg`);
  const theme = "army";
  const T = THEMES[theme];

  const handleOpen = () => setOpened(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ambil data berdasarkan email atau template
        const q = query(
          collection(db, "pembelian"),
          where("template", "==", "Gold 8"),
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
          <p className="text-green-700 uppercase tracking-widest mb-6">
            Our Journey
          </p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`shadow-md rounded-2xl p-8 max-w-md w-full border ${T.border} relative z-10 ${T.card}`}
          >
            <p className="text-green-800 text-sm">Dear</p>
            <p className="font-bold text-green-900 mb-4">
              {namaTamu || "Nama Tamu"}
            </p>
            <p className="italic text-green-700 mb-2">The wedding of</p>
            <h1 className="text-3xl font-serif font-bold text-green-900 mb-6">
              {dataMempelai?.panggilanPria || "Putra"} &{" "}
              {dataMempelai?.panggilanWanita || "Putri"}
            </h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className={`text-white px-6 py-3 rounded-md font-semibold shadow-md mx-auto ${T.cta}`}
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

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative flex flex-col items-center justify-center text-center bg-[#e6f0e6] min-h-screen px-6 overflow-hidden"
          >
            <div className="mt-20 mb-8 z-10">
              <h1 className="text-5xl font-serif text-green-900 leading-tight">
                {dataMempelai?.panggilanPria || "Putra"}
              </h1>
              <p className="text-3xl font-serif text-green-700">&</p>
              <h1 className="text-5xl font-serif text-green-900">
                {dataMempelai?.panggilanWanita || "Putri"}
              </h1>
            </div>

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
                alt={`${dataMempelai?.panggilanPria} & ${dataMempelai?.panggilanWanita}`}
                className="w-[400px] h-[400px] rounded-2xl object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Countdown Section */}
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

          {/* Mempelai Section - Template Gold 8 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative flex flex-col md:flex-row items-center justify-center gap-12 py-16 bg-[#d1e0d1] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-green-50 via-green-100 to-green-200 opacity-70"></div>

            {/* Foto + Nama Pria */}
            <div className="flex flex-col items-center z-10">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="relative overflow-hidden rounded-2xl shadow-xl hover:grayscale-0 transition-all duration-700 border border-green-700"
              >
                <img
                  src={
                    dataMempelai?.fotoMempelaiPria[0] || "/foto-dummy/pria.png"
                  }
                  alt="Mempelai Pria"
                  className="w-64 h-80 object-cover"
                />
                <div className="absolute inset-0 bg-green-900/10 mix-blend-multiply"></div>
              </motion.div>

              {/* Nama & Orang Tua */}
              <div className="mt-4 bg-white rounded-xl shadow-md p-4 text-center w-64 border border-green-200">
                <p className="text-lg font-serif font-semibold text-green-900">
                  {dataMempelai?.namaLengkapPria || "Nama Pria"}
                </p>
                <p className="text-sm text-green-700">
                  Putra dari{" "}
                  {dataMempelai?.ayahMempelaiPria || "Nama Orang Tua Pria"}
                </p>
              </div>
            </div>

            {/* Pembatas / Simbol & */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="z-10 flex flex-col items-center"
            >
              <div className="w-px h-16 bg-green-700 mb-4"></div>
              <p className="text-green-700 font-serif text-lg italic">&</p>
              <div className="w-px h-16 bg-green-700 mt-4"></div>
            </motion.div>

            {/* Foto + Nama Wanita */}
            <div className="flex flex-col items-center z-10">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="relative overflow-hidden rounded-2xl shadow-xl hover:grayscale-0 transition-all duration-700 border border-green-700"
              >
                <img
                  src={
                    dataMempelai?.fotoMempelaiWanita[0] ||
                    "/foto-dummy/wanita.png"
                  }
                  alt="Mempelai Wanita"
                  className="w-64 h-80 object-cover"
                />
                <div className="absolute inset-0 bg-green-900/10 mix-blend-multiply"></div>
              </motion.div>

              {/* Nama & Orang Tua */}
              <div className="mt-4 bg-white rounded-xl shadow-md p-4 text-center w-64 border border-green-200">
                <p className="text-lg font-serif font-semibold text-green-900">
                  {dataMempelai?.namaLengkapWanita || "Nama Wanita"}
                </p>
                <p className="text-sm text-green-700">
                  Putri dari{" "}
                  {dataMempelai?.ayahMempelaiWanita || "Nama Orang Tua Wanita"}
                </p>
              </div>
            </div>
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
                          className={`border border-gray-200 shadow-md rounded-2xl p-6 max-w-sm ${
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
                          className={`border border-gray-200 shadow-md rounded-2xl p-6 max-w-sm ${
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

          {/* Galeri Foto Mini (4 foto di atas slider) */}
          <motion.section className="py-10 px-4 md:px-6">
            <h3 className="text-center font-bold text-lg md:text-xl mb-6 text-green-900">
              Our Galeri
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(dataMempelai?.gallery?.length ?? 0
                ? dataMempelai.gallery
                : [
                    "/foto-dummy/slider1.avif",
                    "/foto-dummy/slider2.jpeg",
                    "/foto-dummy/slider3.avif",
                    "/foto-dummy/slider4.jpg",
                  ]
              ).map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="overflow-hidden rounded-xl border border-green-700 shadow-lg"
                >
                  <Image
                    src={src}
                    width={400}
                    height={400}
                    alt={`Galeri Mini ${i + 1}`}
                    className="object-cover w-full h-40 md:h-48 transform transition-transform duration-500 hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Galeri Foto Slider */}
          <motion.section className="py-10 px-4 md:px-6">
            <h3 className="text-center font-bold text-lg md:text-xl mb-6 text-green-900">
              Galeri Foto
            </h3>

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
              {(dataMempelai?.gallery?.length ?? 0
                ? dataMempelai.gallery
                : [
                    "/foto-dummy/slider1.avif",
                    "/foto-dummy/slider2.jpeg",
                    "/foto-dummy/slider3.avif",
                    "/foto-dummy/slider4.jpg",
                  ]
              ).map((src, i) => (
                <SwiperSlide key={i}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Image
                      src={src}
                      width={400}
                      height={400}
                      alt={`Galeri ${i + 1}`}
                      className="rounded-xl border border-green-700 object-cover w-full h-40 sm:h-44 md:h-48 shadow-lg"
                    />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.section>

          {/* Lokasi Section */}
          <motion.section
            className="py-16 px-6 bg-[#d1e0d1] text-green-900"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h2 className="text-4xl font-serif text-center mb-10">
              Lokasi Acara
            </h2>
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-center">
              <iframe
                src={
                  dataMempelai?.linkMaps ||
                  "https://www.google.com/maps/embed?pb=!1m18..."
                }
                width="100%"
                height="300"
                className="rounded-xl border border-green-700"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-semibold mb-2">Akad & Resepsi</h3>
                <p>25 November 2025</p>
                <p>Jl. Contoh Alamat No.123, Jakarta</p>
              </div>
            </div>
          </motion.section>

          {/* Amplop Section */}
          <motion.section
            className="py-16 px-6 bg-[#cce0cc] text-green-900 text-center"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h2 className="text-4xl font-serif mb-6">Amplop Digital</h2>
            <p className="mb-8">Bagi yang ingin memberikan doa dan support:</p>

            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
              {dataMempelai?.rekening?.length > 0 ? (
                dataMempelai.rekening.map((rek, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-green-700 shadow-md p-6 text-left"
                  >
                    <h3 className="font-semibold text-lg mb-1">
                      {rek.jenisRekening}
                    </h3>
                    <p className="text-gray-700 mb-1">
                      No. Rekening: {rek.nomor}
                    </p>
                    <p className="text-gray-700 mb-2">a.n. {rek.nama}</p>
                    <button
                      className="px-4 py-2 text-sm bg-green-700 text-white rounded-full hover:bg-green-800"
                      onClick={() => navigator.clipboard.writeText(rek.nomor)}
                    >
                      Salin Nomor
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl border border-green-700 shadow-md p-6">
                  <p className="text-gray-700">Tidak ada rekening tersedia.</p>
                </div>
              )}
            </div>
          </motion.section>

          {/* RSVP Section */}
          <motion.section
            className="py-16 px-6 bg-[#cce0cc] text-green-900"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h2 className="text-4xl font-serif text-center mb-10">
              Konfirmasi Kehadiran
            </h2>
            <form
              ref={rsvpRef}
              onSubmit={handleSubmit}
              className="max-w-md mx-auto flex flex-col gap-6"
            >
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama Anda"
                className="px-4 py-3 rounded-md border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <select
                name="kehadiran"
                value={formData.kehadiran}
                onChange={handleChange}
                className="px-4 py-3 rounded-md border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Pilih Kehadiran</option>
                <option value="Hadir">Hadir</option>
                <option value="Tidak Hadir">Tidak Hadir</option>
              </select>
              <button
                type="submit"
                className={`text-white px-6 py-3 rounded-md font-semibold shadow-md mx-auto ${T.cta}`}
              >
                Kirim
              </button>
            </form>
          </motion.section>

          {/* Daftar Kehadiran & Komentar */}
          <motion.section
            className="py-16 px-6 bg-white text-green-900"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h2 className="text-4xl font-serif text-center mb-10">
              Daftar Kehadiran & Ucapan
            </h2>

            <div className="max-w-3xl mx-auto">
              <ul className="space-y-4">
                {messages.map((msg, idx) => (
                  <li
                    key={idx}
                    className={`p-4 rounded-2xl shadow ${
                      msg.kehadiran === "Hadir" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <p className="font-semibold">{msg.name}</p>
                    <p className="text-sm text-gray-500">{msg.time}</p>
                    <p className="mt-2 text-gray-700">{msg.message}</p>
                    <p className="mt-1 text-xs italic">
                      Kehadiran: {msg.kehadiran || "Belum dikonfirmasi"}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              <div className="mt-6 flex justify-center gap-2">
                <button className="px-3 py-1 rounded border border-green-700 bg-green-50 hover:bg-green-100">
                  1
                </button>
                <button className="px-3 py-1 rounded border border-green-700 bg-green-50 hover:bg-green-100">
                  2
                </button>
                <button className="px-3 py-1 rounded border border-green-700 bg-green-50 hover:bg-green-100">
                  3
                </button>
              </div>
            </div>
          </motion.section>

          {/* Penutup Section */}
          <motion.section
            className="py-16 px-6 bg-[#d1e0d1] text-green-900 text-center"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h2 className="text-4xl font-serif mb-4">Terima Kasih</h2>
            <p className="mb-2">
              Atas doa dan kehadiran Anda di hari bahagia kami.
            </p>
            <p className="italic">
              {dataMempelai?.panggilanPria || "Putra"} &{" "}
              {dataMempelai?.panggilanWanita || "Putri"}
            </p>
          </motion.section>
        </div>
      )}
    </main>
  );
}
