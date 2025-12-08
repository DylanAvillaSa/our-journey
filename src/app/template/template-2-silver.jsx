"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/libs/config";
import Image from "next/image";
import CountdownSection from "@/components/paket/silver/template1/CountdownSection";
import { useSearchParams } from "next/navigation";

export default function Template2Silver({ id, data }) {
  const rsvpRef = useRef(null);
  const searchParams = useSearchParams();
  const namaTamu = searchParams.get("to");
  const [dataMempelai, setDataMempelai] = useState(data || null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [formDataTamu, setFormDataTamu] = useState({
    ucapan: "",
    nama_tamu_undangan: "",
    kehadiran: "",
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [opened, setOpened] = useState(false);

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

  // ambil data dari firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "pembelian"),
          where("template", "==", "Silver 2"),
          where("status_pembayaran", "==", "lunas")
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty && id !== undefined) {
          const doc = querySnapshot.docs[0].data();
          setDataMempelai(doc.dataMempelai);
        } else {
          console.log("❌ Tidak ada data ditemukan untuk template ini");
        }
      } catch (err) {
        console.error("Gagal ambil data Firestore:", err);
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

  useEffect(() => {
    if (opened && rsvpRef.current) {
      setTimeout(() => {
        rsvpRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 800);
    }
  }, [opened]);

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

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center bg-[#EAF4FB] text-[#1E3A8A] relative overflow-hidden scroll-smooth"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {/* Welcome Screen */}
      {!opened && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className={`z-10 bg-[#EAF4FB]/90 backdrop-blur-md p-6 rounded-lg shadow-lg`}
        >
          <p className="text-sm mb-4">We Invite You To</p>
          <div className="rounded-full overflow-hidden border-4 border-[#93C5FD] w-40 h-40 mx-auto mb-4">
            <Image
              src="/foto-dummy/pembuka.jpg"
              width={160}
              height={160}
              className="h-full object-cover"
              alt="pasangan"
            />
          </div>

          <h1 className="text-3xl font-bold mb-2 text-[#2563EB]">
            {dataMempelai?.namaLengkapPria} & {dataMempelai?.namaLengkapWanita}
          </h1>
          <p className="text-sm text-[#1D4ED8]">
            Tanpa Mengurangi Rasa Hormat, Kami Mengundang Bapak/Ibu/Saudara/i
            untuk Hadir di Acara Kami.
          </p>
          <p className="mt-2 text-[#1E3A8A] font-semibold">
            Kepada {namaTamu || "Nama Tamu"}
          </p>
          <motion.button
            onClick={handleOpen}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="mt-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2 px-4 rounded-full shadow"
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
          className="text-center p-4 bg-[#EAF4FB] min-h-screen relative text-[#1E3A8A] mt-24"
        >
          {/* 🎵 Audio Button */}
          {opened && (
            <div className="fixed bottom-6 right-6 z-50">
              <button
                onClick={toggleAudio}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white p-4 rounded-full shadow-lg transition transform hover:scale-105 focus:outline-none"
              >
                {isPlaying ? "⏸️" : "🎵"}
              </button>
            </div>
          )}

          <Image
            src="/asset/florar.png"
            alt="flower deco"
            width={120}
            height={120}
            className="absolute top-0 left-0 w-40 md:w-60 rotate-[-20deg]"
          />

          <Image
            src="/foto-dummy/pembuka.jpg"
            width={160}
            height={160}
            alt="Foto Mempelai"
            className="mx-auto w-40 h-40 rounded-full border-4 border-[#93C5FD] object-cover"
          />

          <h2 className="mt-4 text-3xl font-cursive text-[#2563EB]">
            The Wedding of {dataMempelai?.panggilanPria} &{" "}
            {dataMempelai?.panggilanWanita}
          </h2>

          <p className="mt-4 text-sm text-[#1E40AF]">
            وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ ...
          </p>

          <h2 className="mt-4 text-[#2563EB]">- Ar-Rum Ayat 21 -</h2>

          <CountdownSection
            date={`${dataMempelai?.countdownDate}T${dataMempelai?.countdownTime}`}
          />

          {/* Kedua mempelai */}
          <section className="bg-[#DBEAFE] mt-10 flex flex-col items-center text-center px-4 pb-20 pt-10 relative">
            <p className="text-[#1E3A8A] text-xl md:text-2xl font-arabic mt-8">
              ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللّٰهِ وَبَرَكَاتُهُ
            </p>

            <p className="text-[#1E40AF] max-w-xl mt-4 leading-relaxed text-sm md:text-base">
              Atas Berkah dan Rahmat Allah Subhanallahu Wa Ta'ala...
            </p>

            <div className="rounded-full border-4 border-[#93C5FD] w-52 h-52 mx-auto overflow-hidden mt-6">
              <img
                src="/foto-dummy/pria.png"
                alt="Groom"
                className="object-cover w-full h-full"
              />
            </div>

            <h2 className="text-[#2563EB] text-2xl font-semibold mt-6">
              {dataMempelai?.namaLengkapPria}
            </h2>
            <p className="text-[#1E40AF] text-sm mt-2">
              Anak Pertama dari Bapak{" "}
              {dataMempelai?.ayahMempelaiPria || "Samsuri"} dan Ibu{" "}
              {dataMempelai?.ibuMempelaiPria || "Santi"}
            </p>

            <h2 className="text-5xl text-[#1E3A8A] my-12">&</h2>

            <div className="rounded-full border-4 border-[#93C5FD] w-52 h-52 mx-auto overflow-hidden">
              <img
                src="/foto-dummy/wanita.png"
                alt="Bride"
                className="object-cover w-full h-full"
              />
            </div>

            <h2 className="text-[#2563EB] text-2xl font-semibold mt-6">
              {dataMempelai?.namaLengkapWanita || "Fitri Ai"}
            </h2>
            <p className="text-[#1E40AF] text-sm mt-2">
              Anak Kedua dari Pasangan{" "}
              {dataMempelai?.ayahMempelaiWanita || "Samsul"} dan Ibu{" "}
              {dataMempelai?.ibuMempelaiWanita || "Fitri"}
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
                <div className="absolute inset-0 bg-[#2563EB]/35 mix-blend-multiply z-10" />
                {/* Text Save The Date */}
                <h2 className="absolute inset-0 z-20 flex items-center justify-center text-white text-3xl md:text-4xl font-[GreatVibes] drop-shadow-lg">
                  Save The Date
                </h2>
              </div>
            </div>

            {/* Card Info */}
            <div className="relative w-[90%] max-w-md -mt-12 z-40">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl px-6 py-6 border-[3px] border-dashed border-white shadow-[0_25px_40px_rgba(0,0,0,0.25)]">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  {dataMempelai?.tanggalAkad || "Belum ada tanggal"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Pukul {dataMempelai?.jamAkad || "Belum ada jam"}
                </p>
                <p className="text-sm text-gray-700 mt-3">
                  {dataMempelai?.lokasiAkad || "Alamat belum tersedia"}
                </p>
              </div>
            </div>
          </section>

          {/* Lokasi Akad */}
          <section className="mt-16">
            <h2 className="text-3xl font-[GreatVibes] text-[#2563EB] mb-6">
              Lokasi Akad & Resepsi
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-[#93C5FD]">
                <h3 className="text-xl font-semibold text-[#1E3A8A] mb-2">
                  Akad Nikah
                </h3>
                <a
                  href={dataMempelai?.linkMaps}
                  target="_blank"
                  className="inline-block mt-3 text-sm text-white bg-[#3B82F6] px-4 py-2 rounded-full hover:bg-[#2563EB] transition"
                >
                  Lihat Lokasi
                </a>
              </div>

              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-[#93C5FD]">
                <h3 className="text-xl font-semibold text-[#1E3A8A] mb-2">
                  Resepsi
                </h3>
                <a
                  href={dataMempelai?.linkMapsResepsi}
                  target="_blank"
                  className="inline-block mt-3 text-sm text-white bg-[#3B82F6] px-4 py-2 rounded-full hover:bg-[#2563EB] transition"
                >
                  Lihat Lokasi
                </a>
              </div>
            </div>
          </section>

          {/* Amplop Digital */}
          <section className="mt-20 bg-[#DBEAFE] py-10 px-6 rounded-2xl border border-[#93C5FD] max-w-3xl mx-auto">
            <h2 className="text-3xl font-[GreatVibes] text-[#2563EB] mb-6">
              Amplop Digital
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              {dataMempelai?.rekening?.length > 0 ? (
                dataMempelai.rekening.map((rek, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-[#93C5FD] shadow-md p-4"
                  >
                    <h3 className="font-semibold text-[#1E3A8A]">
                      {rek.bank || "BNI"}
                    </h3>
                    <p className="text-sm">
                      No. Rekening: {rek.nomor || "1234567890"}
                    </p>
                    <p className="text-sm text-gray-600">
                      a.n. {rek.nama || dataMempelai?.namaLengkapPria}
                    </p>
                    <button
                      className="mt-3 px-4 py-2 text-sm bg-[#3B82F6] text-white rounded-full hover:bg-[#2563EB]"
                      onClick={() => navigator.clipboard.writeText(rek.nomor)}
                    >
                      Salin Nomor
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl border border-[#93C5FD] shadow-md p-4">
                  <h3 className="font-semibold text-[#1E3A8A]">
                    {dataMempelai?.bank || "BNI"}
                  </h3>
                  <p className="text-sm">
                    No. Rekening: {dataMempelai?.nomor || "1234567890"}
                  </p>
                  <p className="text-sm text-gray-600">
                    a.n. {dataMempelai?.namaLengkapPria || "Putra Sandhika"}
                  </p>
                  <button
                    className="mt-3 px-4 py-2 text-sm bg-[#3B82F6] text-white rounded-full hover:bg-[#2563EB]"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        dataMempelai?.nomor || "1234567890"
                      )
                    }
                  >
                    Salin Nomor
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ucapan terimakasih */}
          <section className="mt-16">
            <p>
              Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga,
              apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa
              restu. Atas kehadiran dan doa restunya, kami mengucapkan terima
              kasih.
            </p>
          </section>

          {/* Form RSVP */}
          <section className="py-10 px-4 bg-cover bg-center">
            <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#93C5FD]">
              <h1 className="text-center text-3xl font-[GreatVibes] text-[#2563EB] mb-6">
                Kehadiran
              </h1>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Masukkan nama"
                  name="nama_tamu_undangan"
                  value={formDataTamu?.nama_tamu_undangan}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#2563EB]"
                />
                <textarea
                  placeholder="Tulis ucapan untuk mempelai"
                  name="ucapan"
                  onChange={handleChange}
                  value={formDataTamu?.ucapan}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#2563EB]"
                ></textarea>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#2563EB]"
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
                  className={` w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2 rounded-lg transition duration-300
                    ${loading && "opacity-35"} ${
                    !dataMempelai?.template && "opacity-35"
                  }`}
                >
                  {loading ? "Menunggu..." : "Kirim"}
                </button>
              </form>
            </div>
          </section>

          {/* section tamu undangan */}
          <section className="py-8 px-4 bg-cover bg-center">
            <div className="max-w-lg mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-5 border border-blue-200">
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
