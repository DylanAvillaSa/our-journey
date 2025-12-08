"use client";
import { useState } from "react";
import Image from "next/image";

export default function ShareWA({ purchases }) {
  if (purchases.length === 0)
    return (
      <div className="text-center py-24">
        <p className="text-gray-600 text-lg">
          Belum ada pesanan. Yuk pilih template dulu ✨
        </p>
      </div>
    );
  const [namaTeman, setNamaTeman] = useState("");
  const id = purchases[0]?.idPembelian;
  const namaPria = purchases[0]?.dataMempelai?.panggilanPria;
  const namaWanita = purchases[0]?.dataMempelai?.panggilanWanita;

  const kirimWA = () => {
    if (!namaTeman) return alert("Isi nama teman dulu ya!");

    const baseUrl = window.location.origin;

    const pesan = `
Assalamu’alaikum Wr.Wb 
Bismillahirahmanirrahim

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i ${namaTeman}  untuk menghadiri acara kami.

${namaPria} & ${namaWanita} 

Berikut link undangan kami, untuk info lengkap dari acara bisa kunjungi :

${baseUrl}/template-pembeli/${id}?to=${encodeURIComponent(namaTeman)}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Mohon maaf perihal undangan hanya di bagikan melalui pesan ini. Terimakasih atas perhatiannya. 

Wassalamualaikum Wr.Wb
`;

    const url = `https://wa.me/?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-10 bg-gradient-to-br flex flex-col justify-center items-center min-h-screen from-white/80 to-white/60 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl">
      {/* Judul */}
      <h2 className="text-3xl font-bold text-center mt-3 mb-3 text-[#d4a656] drop-shadow-sm">
        Bagikan Undangan ✨
      </h2>

      {/* Deskripsi */}
      <p className="text-gray-600 text-sm text-center mb-6 leading-relaxed">
        Kirim undangan personal ke temanmu melalui WhatsApp dengan menambahkan
        nama mereka di pesan dan link undangan.
      </p>

      {/* Input Nama */}
      <div className="relative mb-5">
        <input
          type="text"
          placeholder="Masukkan nama teman..."
          value={namaTeman}
          onChange={(e) => setNamaTeman(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/70 text-gray-800 placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-[#d4a656] focus:border-transparent transition-all duration-300"
        />
        <span className="absolute right-3 top-3 text-[#d4a656]">
          <i className="fa-solid fa-user"></i>
        </span>
      </div>

      {/* Tombol Share */}
      <button
        onClick={kirimWA}
        className="w-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold py-3 rounded-xl 
               shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path d="M20.52 3.48A11.77 11.77 0 0012.07 0C5.64 0 .44 5.19.44 11.62a11.59 11.59 0 001.59 5.9L0 24l6.64-1.95a11.74 11.74 0 005.44 1.38h.01c6.43 0 11.63-5.19 11.63-11.62a11.52 11.52 0 00-3.2-8.33zM12.08 21.5a9.54 9.54 0 01-4.85-1.3l-.35-.2-3.94 1.16 1.15-3.84-.22-.4a9.5 9.5 0 01-1.42-5c0-5.25 4.28-9.52 9.53-9.52a9.52 9.52 0 016.73 2.8 9.5 9.5 0 012.79 6.72c0 5.25-4.28 9.52-9.52 9.52zm5.23-7.16c-.29-.15-1.7-.83-1.96-.93s-.45-.15-.65.15-.74.93-.91 1.13-.34.22-.63.07a7.81 7.81 0 01-2.29-1.41 8.59 8.59 0 01-1.58-1.97c-.16-.28 0-.44.12-.59.12-.12.28-.3.42-.44s.19-.26.3-.44.06-.33 0-.48c-.06-.15-.65-1.56-.9-2.14s-.48-.49-.65-.5h-.56a1.08 1.08 0 00-.78.36 3.25 3.25 0 00-1.02 2.4 5.64 5.64 0 001.18 2.93 12.91 12.91 0 004.99 4.43c.7.3 1.25.48 1.68.62.7.22 1.33.19 1.83.12.56-.08 1.7-.7 1.95-1.37s.24-1.25.17-1.37-.26-.22-.55-.37z" />
        </svg>
        Share ke WhatsApp
      </button>

      {/* Catatan kecil */}
      <p className="text-xs text-gray-500 text-center mt-5 leading-relaxed">
        📩 Nama teman akan otomatis muncul di pesan WhatsApp dan link undangan.
      </p>

      <p className="text-xl text-center mt-6 font-semibold text-gray-800 leading-relaxed">
        ✨ <span className="text-[#d4a656]">Jasa Isi Undangan Otomatis!</span>{" "}
        ✨
        <br />
        <span className="block mt-3 text-gray-600 text-sm font-normal">
          Biar kamu gak repot kirim satu-satu 💌
          <br />
          Kami bantu isi & kirim otomatis ke tamu kamu!
        </span>
        <span className="inline-block text-sm text-slate-700 bg-[#d4a656] mt-2 px-5 py-2 rounded-full font-bold shadow-sm">
          💸 Hanya Rp 50.000 / 100 Undangan 💸
        </span>
      </p>
    </div>
  );
}
