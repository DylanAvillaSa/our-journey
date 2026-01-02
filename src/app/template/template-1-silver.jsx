"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  setDoc,
  doc,
  arrayUnion,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/libs/config";
import Image from "next/image";
import CountdownSection from "@/components/paket/silver/template1/CountdownSection";
import { useSearchParams } from "next/navigation";

export default function Template1Silver({ id, data }) {
  const rsvpRef = useRef(null);
  const searchParams = useSearchParams();
  const namaTamu = searchParams.get("to");
  const [loading, setLoading] = useState(false);
  const [dataMempelai, setDataMempelai] = useState(data || null);
  const [kehadiran, setKehadiran] = useState("");
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

  // 🔥 Ambil data Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ambil data berdasarkan email atau template
        const q = query(
          collection(db, "pembelian"),
          where("template", "==", "Silver 1"),
          where("status_pembayaran", "==", "lunas")
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty && id !== undefined) {
          const doc = querySnapshot.docs[0].data();
          setDataMempelai(doc.dataMempelai);
        } else {
          console.log("");
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
      }, 800); // tunggu animasi selesai
    }
  }, [opened]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataTamu({ ...formDataTamu, [name]: value });
  };

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

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center bg-[#F9F5F2] text-[#6F4E37] relative overflow-hidden scroll-smooth"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {/* Welcome Screen */}
      {!opened && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className={`z-10 bg-[#F9F5F2]/90 backdrop-blur-md p-6 rounded-lg shadow-lg ${
            kehadiran && "hidden"
          }`}
        >
          <p className="text-sm mb-4">We Invite You To</p>
          <div className="rounded-full overflow-hidden border-4 border-[#D3BAA2] w-40 h-40 mx-auto mb-4">
            <Image
              src="/foto-dummy/pembuka.jpg"
              width={160}
              height={160}
              className="h-full object-cover"
              alt="pasangan"
            />
          </div>

          <h1 className="text-3xl font-bold mb-2 text-[#A47148]">
            {dataMempelai?.namaLengkapPria || "Randy"} &{" "}
            {dataMempelai?.namaLengkapWanita || "Santi"}
          </h1>
          <p className="text-sm text-[#7B5E57]">
            Tanpa Mengurangi Rasa Hormat, Kami Mengundang Bapak/Ibu/Saudara/i
            untuk Hadir di Acara Kami.
          </p>
          <p className="mt-2 text-[#4A3C35] font-semibold">
            Kepada {namaTamu || "Nama Tamu"}
          </p>
          <motion.button
            onClick={handleOpen}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="mt-4 bg-[#CBB59D] hover:bg-[#b6a086] text-white py-2 px-4 rounded-full shadow"
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
          className="text-center p-4 bg-[#F9F5F2] min-h-screen relative text-[#6F4E37] mt-24"
        >
          {/* 🎵 Audio Backsound */}
          <audio
            ref={audioRef}
            src={dataMempelai?.backsound}
            loop
            preload="auto"
          />

          {/* 🎵 Tombol Play/Pause Melayang */}
          {opened && (
            <div className="fixed bottom-6 right-6 z-50">
              <button
                onClick={toggleAudio}
                className="bg-[#CBB59D] hover:bg-[#b6a086] text-white p-4 rounded-full shadow-lg transition transform hover:scale-105 focus:outline-none"
              >
                {isPlaying ? "⏸️" : "🎵"}
              </button>
            </div>
          )}
          <Image
            src="/asset/ornament.png"
            alt="flower deco"
            width={120}
            height={120}
            className="absolute top-0 left-0 w-40 md:w-60 rotate-[-20deg]"
          />
          <Image
            src="/asset/ornament.png"
            alt="flower deco"
            width={200}
            height={200}
            className="absolute top-0 right-0 w-40 md:w-60 rotate-[20deg]"
          />

          {/* Gambar mempelai */}
          <Image
            src={dataMempelai?.fotoMempelaiWanita || "/foto-dummy/wanita.png"}
            width={160}
            height={160}
            alt="Foto Mempelai"
            className="mx-auto w-40 h-40 rounded-full border-4 border-[#D3BAA2] object-cover"
          />

          {/* Nama mempelai */}
          <h2 className="mt-4 text-3xl font-cursive text-[#A47148]">
            The Wedding of {dataMempelai?.panggilanPria || "Randy"} &{" "}
            {dataMempelai?.panggilanWanita || "Santi"}
          </h2>

          {/* Ucapan Terima Kasih */}

          <p className="mt-4 text-sm">
            وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا
            لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً
            وَّرَحْمَةًۗ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ
          </p>

          <p className="mt-4 text-sm">
            Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan
            pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu
            merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan
            kasih sayang. Sesungguhnya pada yang demikian itu benar-benar
            terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.
          </p>

          <h2 className="mt-4">- Ar-Rum Ayat 21 -</h2>

          {/* Countdown */}
          <CountdownSection
            date={`${dataMempelai?.countdownDate}T${dataMempelai?.countdownTime}`}
          />

          {/*kedua mempelai */}
          <section>
            {/* mempelai pria */}
            <section className="bg-[#f8f4f2] flex flex-col items-center text-center px-4 pb-20 pt-10 relative">
              {/* Ornamen atas */}
              <img
                src="/asset/ornament.png"
                alt="Ornament Top"
                className="absolute top-0 left-0 w-[110px] h-[110px] object-cover"
              />

              {/* Salam pembuka */}
              <p className="text-[#6a5f58] text-xl md:text-2xl font-arabic mt-8">
                ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللّٰهِ وَبَرَكَاتُهُ
              </p>

              {/* Teks undangan */}
              <p className="text-[#4d4139] max-w-xl mt-4 leading-relaxed text-sm md:text-base">
                Atas Berkah dan Rahmat Allah Subhanallahu Wa Ta'ala. Tanpa
                mengurangi rasa hormat. Kami mengundang Bapak/Ibu/Saudara/i
                serta kerabat sekalian untuk menghadiri acara pernikahan kami:
              </p>

              {/* Foto mempelai */}
              <div className="relative mt-6">
                <div className="rounded-full border-4 border-[#e2d6cd] w-52 h-52 mx-auto overflow-hidden">
                  <img
                    src={
                      dataMempelai?.fotoMempelaiPria || "/foto-dummy/pria.png"
                    }
                    alt="Groom"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Nama dan keterangan */}
              <h2 className="text-[#826259] text-2xl font-semibold mt-6">
                {dataMempelai?.namaLengkapPria || "Randy Samsuri"}
              </h2>
              <p className="text-[#4d4139] text-sm mt-2">
                Anak dari Pasangan <br />
                Bapak {dataMempelai?.ayahMempelaiPria || "Samsul"}& <br />
                Ibu Si {dataMempelai?.ibuMempelaiPria || "Sumiati"} <br />
              </p>
            </section>

            <h2 className="text-5xl  text-[#6a5f58] mb-12">&</h2>

            {/* mempelai wanita */}
            <section className="bg-[#f8f4f2] flex flex-col items-center text-center px-4 pb-20 pt-10 relative">
              {/* Ornamen atas */}
              <img
                src="/asset/ornament.png"
                alt="Ornament Top"
                className="absolute top-0 left-0 w-[110px] h-[110px] object-cover"
              />

              {/* Foto mempelai */}
              <div className="relative mt-6">
                <div className="rounded-full border-4 border-[#e2d6cd] w-52 h-52 mx-auto overflow-hidden">
                  <img
                    src="/foto-dummy/wanita.png"
                    alt="Groom"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Nama dan keterangan */}
              <h2 className="text-[#826259] text-2xl font-semibold mt-6">
                {dataMempelai?.namaLengkapWanita || "Santi Julianti"}
              </h2>
              <p className="text-[#4d4139] text-sm mt-2">
                Anak dari Pasangan <br />
                Bapak Si {dataMempelai?.ayahMempelaiWanita || "Samsuri"} &{" "}
                <br />
                Ibu Si {dataMempelai?.ibuMempelaiWanita || "Siti"} <br />
              </p>
            </section>
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
                {/* Overlay warna coklat */}
                <div className="absolute inset-0 bg-[#A47148]/35 mix-blend-multiply z-10" />
                {/* Text Save The Date */}
                <h2 className="absolute inset-0 z-20 flex items-center justify-center text-white text-3xl md:text-4xl font-[GreatVibes] drop-shadow-lg">
                  Save The Date
                </h2>
              </div>
            </div>

            {/* Card Info */}
          </section>

          {/* Lokasi Akad & Resepsi */}
          <section className="mt-16">
            <h2 className="text-3xl font-[GreatVibes] text-[#A47148] mb-6">
              Lokasi Akad & Resepsi
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Akad */}
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-[#E6D3B1]">
                <h3 className="text-xl font-semibold text-[#6F4E37] mb-2">
                  Akad Nikah
                </h3>
                <p className="text-sm text-gray-700">
                  {dataMempelai?.akadTanggal || "23 Oktober 2025"} <br />
                  Pukul {`${dataMempelai?.jamAkad || "09:00"} WIB`} <br />
                  {dataMempelai?.lokasiAkad}
                </p>
                <a
                  href={dataMempelai?.linkMaps}
                  target="_blank"
                  className="inline-block mt-3 text-sm text-white bg-[#A47148] px-4 py-2 rounded-full hover:bg-[#8c5f3b] transition"
                >
                  Lihat Lokasi
                </a>
              </div>

              {/* Resepsi */}
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-[#E6D3B1]">
                <h3 className="text-xl font-semibold text-[#6F4E37] mb-2">
                  Resepsi
                </h3>
                <p className="text-sm text-gray-700">
                  {dataMempelai?.tanggalResepsi || "24 Oktober 2025"} <br />
                  Pukul {`${dataMempelai?.jamResepsi || "10:00"} WIB`} <br />
                  {dataMempelai?.lokasiResepsi}
                </p>
                <a
                  href={dataMempelai?.linkMapsResepsi}
                  target="_blank"
                  className="inline-block mt-3 text-sm text-white bg-[#A47148] px-4 py-2 rounded-full hover:bg-[#8c5f3b] transition"
                >
                  Lihat Lokasi
                </a>
              </div>
            </div>
          </section>

          {/* Amplop Digital */}
          <section className="mt-20 bg-[#F6EFEA] py-10 px-6 rounded-2xl border border-[#E6D3B1] max-w-3xl mx-auto">
            <h2 className="text-3xl font-[GreatVibes] text-[#A47148] mb-6">
              Amplop Digital
            </h2>
            <p className="text-sm text-gray-700 max-w-md mx-auto mb-4">
              Bagi keluarga dan sahabat yang ingin mengirimkan hadiah, kami
              menyediakan amplop digital sebagai ungkapan kasih.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              {dataMempelai?.rekening?.length > 0 ? (
                dataMempelai.rekening.map((rek, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-[#E6D3B1] shadow-md p-4"
                  >
                    <h3 className="font-semibold text-[#6F4E37]">
                      {rek.bank || "BCA"}
                    </h3>
                    <p className="text-sm">
                      No. Rekening: {rek.nomor || "1234567890"}
                    </p>
                    <p className="text-sm text-gray-600">
                      a.n. {rek.nama || dataMempelai?.namaLengkapPria}
                    </p>
                    <button
                      className="mt-3 px-4 py-2 text-sm bg-[#A47148] text-white rounded-full hover:bg-[#8c5f3b]"
                      onClick={() =>
                        navigator.clipboard.writeText(rek.nomorRekening)
                      }
                    >
                      Salin Nomor
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl border border-[#E6D3B1] shadow-md p-4">
                  <h3 className="font-semibold text-[#6F4E37]">
                    {dataMempelai?.bank || "BCA"}
                  </h3>
                  <p className="text-sm">
                    No. Rekening: {dataMempelai?.nomor || "1234567890"}
                  </p>
                  <p className="text-sm text-gray-600">
                    a.n. {dataMempelai?.nama}
                  </p>
                  <button
                    className="mt-3 px-4 py-2 text-sm bg-[#A47148] text-white rounded-full hover:bg-[#8c5f3b]"
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

          {/* form rsvp */}
          <section className="py-10 px-4 bg-cover bg-center">
            <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-yellow-300">
              {/* Judul */}
              <h1 className="text-center text-3xl font-[GreatVibes] text-[#A47148] mb-6">
                Kehadiran
              </h1>

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Nama */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="nama_tamu_undangan"
                    value={formDataTamu.nama_tamu_undangan}
                    onChange={handleChange}
                    placeholder="Masukkan nama"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#A47148]"
                  />
                </div>

                {/* Ucapan */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Ucapan
                  </label>
                  <textarea
                    placeholder="Tulis ucapan untuk mempelai"
                    name="ucapan"
                    value={formDataTamu.ucapan}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#A47148]"
                  ></textarea>
                </div>

                {/* Kehadiran */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Kehadiran
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#A47148]"
                    name="kehadiran"
                    value={formDataTamu.kehadiran}
                    onChange={handleChange}
                  >
                    <option value="">Pilih opsi</option>
                    <option value="hadir">Hadir</option>
                    <option value="tidak">Tidak Hadir</option>
                  </select>
                </div>

                {/* Tombol */}
                <button
                  type="submit"
                  disabled={loading || !dataMempelai?.template}
                  className={`w-full bg-[#A47148] hover:bg-[#8b5e3b] text-white py-2 rounded-lg transition duration-300 ${
                    loading && "opacity-35"
                  } ${!dataMempelai?.template && "opacity-35"}`}
                >
                  {loading ? "Menunggu..." : "Kirim"}
                </button>
              </form>
            </div>
          </section>

          {/* section tamu undangan */}
          <section className="py-8 px-4 bg-cover bg-center">
            <div className="max-w-lg mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-5 border border-yellow-200">
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
