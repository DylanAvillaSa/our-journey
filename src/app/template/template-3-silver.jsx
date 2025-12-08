"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/libs/config";
import Image from "next/image";
import CountdownSection from "@/components/paket/silver/template1/CountdownSection";
import { useSearchParams } from "next/navigation";

export default function Template3Silver({ id, data }) {
  const rsvpRef = useRef(null);
  const searchParams = useSearchParams();
  const namaTamu = searchParams.get("to");
  const [dataMempelai, setDataMempelai] = useState(data || null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState([]);
  const [formDataTamu, setFormDataTamu] = useState({
    ucapan: "",
    nama_tamu_undangan: "",
    kehadiran: "",
  });

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 1000);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // ambil data di firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "pembelian"),
          where("template", "==", "Silver 3"),
          where("status_pembayaran", "==", "lunas")
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty && id !== undefined) {
          const doc = querySnapshot.docs[0].data();
          setDataMempelai(doc.dataMempelai);
        }
      } catch (err) {
        console.error("🔥 Gagal ambil data Firestore:", err);
      }
    };

    fetchData();
  }, []);

  // ambil data ucapan berdasarkan template
  useEffect(() => {
    if (!dataMempelai?.template) return;

    const docRef = doc(db, "ucapan", dataMempelai?.template);

    const unsub = onSnapshot(docRef, (snap) => {
      if (!snap.exists()) return setMessages([]);

      const data = snap.data().ucapanList || [];

      // sort by createdAt terbaru
      const sorted = [...data].sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      setMessages(sorted);
    });

    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const statusKehadiran =
      formDataTamu.kehadiran === "hadir" ? "hadir" : "tidak hadir";

    const docRef = doc(db, "ucapan", dataMempelai?.template);

    try {
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // kalau belum ada, bikin dokumen baru
        await setDoc(docRef, {
          ucapanList: [
            {
              nama: formDataTamu.nama_tamu_undangan,
              ucapan: formDataTamu.ucapan,
              kehadiran: statusKehadiran,
            },
          ],
        });
      } else {
        // kalau udah ada, update array
        await updateDoc(docRef, {
          ucapanList: arrayUnion({
            nama: formDataTamu.nama_tamu_undangan,
            ucapan: formDataTamu.ucapan,
            kehadiran: statusKehadiran,
            createdAt: new Date(),
          }),
        });
      }

      alert("Ucapan berhasil dikirim!");
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim data.");
    } finally {
      setFormDataTamu({
        kehadiran: "",
        nama_tamu_undangan: "",
        ucapan: "",
      });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataTamu({ ...formDataTamu, [name]: value });
  };

  useEffect(() => {
    if (opened && rsvpRef.current) {
      setTimeout(() => {
        rsvpRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 800);
    }
  }, [opened]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center bg-[#0a0a0a] text-[#d4af37] relative overflow-hidden scroll-smooth"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {/* Welcome Screen */}
      {!opened && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="z-10 bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-[#d4af37]/50 shadow-[0_0_25px_rgba(212,175,55,0.4)]"
        >
          <p className="text-sm mb-4 text-[#d4af37]/80">We Invite You To</p>
          <div className="rounded-full overflow-hidden border-4 border-[#d4af37] w-40 h-40 mx-auto mb-4">
            <Image
              src="/foto-dummy/pembuka.jpg"
              width={160}
              height={160}
              className="h-full object-cover"
              alt="pasangan"
            />
          </div>

          <h1 className="text-3xl font-bold mb-2 text-[#d4af37]">
            {dataMempelai?.panggilanPria || "Samsul"} &{" "}
            {dataMempelai?.panggilanWanita || "Fitri"}
          </h1>
          <p className="text-sm text-gray-300 mb-2">
            Dengan penuh rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk
            hadir di acara pernikahan kami.
          </p>
          <p className="text-[#d4af37]/90 font-semibold mb-4">
            Kepada {namaTamu || "Nama Tamu"}
          </p>

          <motion.button
            onClick={handleOpen}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="mt-4 bg-[#d4af37] hover:bg-[#b89329] text-black py-2 px-6 rounded-full font-semibold transition"
          >
            Buka Undangan
          </motion.button>
        </motion.div>
      )}

      {opened && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center p-4 min-h-screen relative text-[#d4af37] mt-24"
        >
          {/* 🎵 Floating Music Button */}
          {opened && (
            <button
              onClick={toggleAudio}
              className="fixed bottom-6 right-6 bg-[#d4af37] text-black p-4 rounded-full shadow-lg hover:bg-[#b89329] transition transform hover:scale-105 z-50"
            >
              {isPlaying ? "⏸️" : "🎵"}
            </button>
          )}

          {/* Hero */}
          <Image
            src="/foto-dummy/pembuka.jpg"
            width={180}
            height={180}
            alt="Foto Mempelai"
            className="mx-auto w-44 h-44 rounded-full border-4 border-[#d4af37] object-cover"
          />

          <h2 className="mt-6 text-3xl font-[GreatVibes] text-[#d4af37]">
            The Wedding of {dataMempelai?.panggilanPria} &{" "}
            {dataMempelai?.panggilanWanita}
          </h2>

          <p className="mt-4 text-sm text-gray-300 italic">
            وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ ...
          </p>
          <h2 className="mt-3 text-[#d4af37]/80">- Ar-Rum Ayat 21 -</h2>

          <CountdownSection />

          {/* Kedua mempelai */}
          <section className="mt-16 py-10 bg-gradient-to-b from-black to-[#1a1a1a] rounded-2xl shadow-inner border border-[#d4af37]/20 max-w-3xl mx-auto">
            <p className="text-[#d4af37]/90 text-xl font-arabic">
              ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللّٰهِ وَبَرَكَاتُهُ
            </p>

            <p className="text-gray-300 max-w-lg mx-auto mt-4 text-sm leading-relaxed">
              Atas Berkah dan Rahmat Allah Subhanallahu Wa Ta'ala...
            </p>

            <div className="rounded-full border-4 border-[#d4af37] w-52 h-52 mx-auto overflow-hidden mt-8">
              <img
                src="/foto-dummy/pria.png"
                alt="Groom"
                className="object-cover w-full h-full"
              />
            </div>

            <h2 className="text-[#d4af37] text-2xl font-semibold mt-6">
              {dataMempelai?.namaLengkapPria || "Samsul Samsuri"}
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Anak dari Pasangan Bapak{" "}
              {dataMempelai?.ayahMempelaiPria || "Handoko"} &{" "}
              {dataMempelai?.ibuMempelaiPria || "Sumiati"}
            </p>

            <h2 className="text-5xl text-[#d4af37]/70 my-12">&</h2>

            <div className="rounded-full border-4 border-[#d4af37] w-52 h-52 mx-auto overflow-hidden">
              <img
                src="/foto-dummy/wanita.png"
                alt="Bride"
                className="object-cover w-full h-full"
              />
            </div>

            <h2 className="text-[#d4af37] text-2xl font-semibold mt-6">
              {dataMempelai?.namaLengkapWanita}
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Anak Kedua dari Pasangan Anak dari Pasangan Bapak{" "}
              {dataMempelai?.ayahMempelaiWanita || "Nanami"} &{" "}
              {dataMempelai?.ibuMempelaiWanita || "Kento"}
            </p>
          </section>

          {/* akad */}
          <section className="flex flex-col items-center text-center mt-8">
            {/* Bagian Foto + Wave */}
            <div className="relative w-full max-w-xl overflow-hidden">
              {/* Foto */}
              <div className="relative w-full h-80 md:h-96">
                <Image
                  src="/foto-dummy/latar.jpg"
                  alt="family"
                  fill
                  className="object-cover rounded-xl"
                />
                {/* Overlay warna biru */}
                <div className="absolute inset-0 bg-white/35 mix-blend-multiply z-10" />
                {/* Text Save The Date */}
                <h2 className="absolute inset-0 z-20 flex items-center justify-center text-3xl md:text-4xl font-[GreatVibes] text-[#f6cd46] text-shadow-2xs drop-shadow-lg">
                  Save The Date
                </h2>
              </div>
            </div>

            {/* Card Info */}
            <div className="relative w-[90%] max-w-md -mt-12 z-40">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl px-6 py-6 border-[3px] border-dashed border-white shadow-[0_25px_40px_rgba(0,0,0,0.25)]">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  {dataMempelai?.akadTanggal || "Belum ada tanggal"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Pukul {dataMempelai?.jam || "Belum ada jam"}
                </p>
                <p className="text-sm text-gray-700 mt-3">
                  {dataMempelai?.alamat || "Belum ada lokasi"}
                </p>
              </div>
            </div>
          </section>

          {/* Lokasi */}
          <section className="mt-20">
            <h2 className="text-3xl font-[GreatVibes] text-[#d4af37] mb-6">
              Lokasi Akad & Resepsi
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {["Akad Nikah", "Resepsi"].map((title, idx) => (
                <div
                  key={idx}
                  className="bg-black/70 backdrop-blur-md p-6 rounded-2xl border border-[#d4af37]/40 shadow-lg"
                >
                  <h3 className="text-xl font-semibold text-[#d4af37] mb-3">
                    {title}
                  </h3>
                  <a
                    href={
                      idx === 0
                        ? dataMempelai?.linkMaps
                        : dataMempelai?.linkMapsResepsi
                    }
                    target="_blank"
                    className="inline-block mt-3 text-sm bg-[#d4af37] text-black px-4 py-2 rounded-full hover:bg-[#b89329] transition"
                  >
                    Lihat Lokasi
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Amplop Digital */}
          <section className="mt-20 bg-black/70 py-10 px-6 rounded-2xl border border-[#d4af37]/40 max-w-3xl mx-auto">
            <h2 className="text-3xl font-[GreatVibes] text-[#d4af37] mb-6">
              Amplop Digital
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {dataMempelai?.rekening.length > 0
                ? dataMempelai?.rekening.map((bank) => (
                    <div
                      key={bank}
                      className="bg-[#0f0f0f]/80 rounded-xl border border-[#d4af37]/30 shadow-md p-4"
                    >
                      <h3 className="font-semibold text-[#d4af37]">{bank}</h3>
                      <button className="mt-3 px-4 py-2 text-sm bg-[#d4af37] text-black rounded-full hover:bg-[#b89329]">
                        Salin Nomor
                      </button>
                    </div>
                  ))
                : ["BCA"].map((bank) => (
                    <div
                      key={bank}
                      className="bg-[#0f0f0f]/80 rounded-xl border border-[#d4af37]/30 shadow-md p-4"
                    >
                      <h3 className="font-semibold text-[#d4af37]">{bank}</h3>
                      <button className="mt-3 px-4 py-2 text-sm bg-[#d4af37] text-black rounded-full hover:bg-[#b89329]">
                        Salin Nomor
                      </button>
                    </div>
                  ))}
            </div>
          </section>

          {/* Ucapan Terima Kasih */}
          <section className="mt-16 text-gray-300 max-w-2xl mx-auto">
            <p>
              Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga
              apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa
              restu. Terima kasih atas doa dan kehadirannya.
            </p>
          </section>

          {/* Form RSVP */}
          <section ref={rsvpRef} className="py-10 px-4 mt-12">
            <div className="max-w-md mx-auto bg-black/80 rounded-2xl border border-[#d4af37]/40 p-6 shadow-xl">
              <h1 className="text-center text-3xl font-[GreatVibes] text-[#d4af37] mb-6">
                Kehadiran
              </h1>
              <form className="space-y-4">
                <input
                  type="text"
                  name="nama_tamu_undangan"
                  value={formDataTamu?.nama_tamu_undangan}
                  onChange={handleChange}
                  placeholder="Masukkan nama"
                  className="w-full bg-transparent border border-[#d4af37]/40 rounded-lg px-3 py-2 text-[#d4af37] focus:outline-none focus:border-[#d4af37]"
                />

                <textarea
                  placeholder="Tulis ucapan untuk mempelai"
                  rows="4"
                  name="ucapan"
                  value={formDataTamu?.ucapan}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-[#d4af37]/40 rounded-lg px-3 py-2 text-[#d4af37] focus:outline-none focus:border-[#d4af37]"
                ></textarea>

                <select
                  className="w-full bg-transparent border border-[#d4af37]/40 rounded-lg px-3 py-2 text-[#d4af37] focus:outline-none focus:border-[#d4af37]"
                  name="kehadiran"
                  value={formDataTamu?.kehadiran}
                  onChange={handleChange}
                >
                  <option value="">Pilih opsi</option>
                  <option value="hadir">Hadir</option>
                  <option value="tidak">Tidak Hadir</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#d4af37] hover:bg-[#b89329] text-black py-2 rounded-lg font-semibold transition duration-300
                     ${loading && "opacity-35"} ${
                    !dataMempelai?.template && "opacity-35"
                  }
                    `}
                >
                  {loading ? "Menunggu..." : "Kirim"}
                </button>
              </form>
            </div>
          </section>

          {/* section tamu undangan */}
          <section className="py-8 px-4 bg-cover bg-center">
            <div className="max-w-lg mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-5 border border-[#d4af37]">
              {/* Statistik */}
              <div className="flex flex-wrap gap-4 text-sm mb-4">
                <div className="flex items-center gap-1 text-blue-600">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  {messages.length} Total Ucapan
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <span className="w-3 h-3 rounded-full bg-green-600"></span>
                  {messages.filter((m) => m.kehadiran).length} Orang Menyatakan
                  Hadir
                </div>
              </div>

              <hr className="border-gray-300 mb-4" />

              {/* List Ucapan */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-transparent">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  >
                    <p className="font-bold text-gray-800">
                      {msg.nama}{" "}
                      <span className="font-normal italic text-gray-500 text-sm">
                        - {msg.kehadiran}
                      </span>
                    </p>
                    <p className="text-gray-700 mt-1">{msg.ucapan}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </motion.div>
      )}
    </main>
  );
}
