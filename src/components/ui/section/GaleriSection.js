"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/libs/config";
import { db } from "@/libs/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Dialog } from "@headlessui/react";

// Templates
const allTemplates = {
  Silver: [1, 2, 3].map((i) => ({
    id: i,
    name: `Silver ${i}`,
    src: `/template/template-${i}.png`,
    link: `/template/template-${i}-silver`,
    paket: "Silver",
  })),
  Gold: [4, 5, 6, 8, 9, 10, 7, 12].map((i, idx) => ({
    id: i,
    name: `Gold ${idx + 1}`,
    src: `/template/template-${i}.png`,
    link:
      i === 7 ? "/template/template-11-gold" : `/template/template-${i}-gold`,
    paket: "Gold",
  })),
  Platinum: [13, 14, 15, 16].map((i, idx) => ({
    id: i,
    name: `Platinum ${idx + 1}`,
    src: `/template/template-${i}.png`,
    link: `/template/template-${i}-platinum`,
    paket: "Platinum",
  })),
};

export default function GaleriTemplateSection() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Silver");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);
  const [deviceId, setDeviceId] = useState(null);

  const templates = allTemplates[selectedCategory];

  // Generate unique ID per device (simulasi identitas)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDeviceId(user.uid);
      } else {
        setDeviceId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOrder = async () => {
    if (!selectedTemplate) return alert("Pilih template dulu bro 😅");

    const now = Date.now();
    const timeDiff = now - lastSubmit;
    if (timeDiff < 8000) {
      alert("Tunggu 8 detik sebelum kirim pesanan lagi ya 🙏");
      return;
    }

    // Validasi input
    if (!nama || nama.trim().length < 2) {
      alert("Nama wajib diisi minimal 2 huruf.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Email tidak valid bro 😅");
      return;
    }

    setLoading(true);
    setLastSubmit(now);

    try {
      await addDoc(collection(db, "pembelian"), {
        deviceId,
        nama_user: nama.trim(),
        email: email.trim().toLowerCase(),
        paket: selectedTemplate.paket,
        template: selectedTemplate.name,
        status: "menunggu_verifikasi",
        link_template: selectedTemplate.link, // sementara bisa null kalau admin yang set
        notif_seen: false, // 🔔 supaya navbar bisa munculkan notif nanti
        createdAt: serverTimestamp(),
      });

      alert(
        "✅ Pesanan berhasil dikirim!\nTunggu verifikasi admin setelah pembayaran ya 🙏"
      );

      setOpenModal(false);
      setNama("");
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("❌ Gagal mengirim pesanan, coba lagi nanti ya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 md:px-24 py-20 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-6">
        📸 Contoh Template
      </h2>

      {/* Switch Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        {["Silver", "Gold", "Platinum"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              selectedCategory === cat
                ? "bg-green-500 text-white shadow-lg"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Templates */}
      <div className="flex flex-wrap justify-center gap-6">
        {templates.map((tpl) => (
          <motion.div
            key={tpl.id}
            whileHover={{ scale: 1.03 }}
            className="relative cursor-pointer rounded-xl overflow-hidden shadow-md bg-gray-100 flex flex-col items-center w-[220px] sm:w-[250px] md:w-[200px]"
          >
            <div className="w-full h-[220px] sm:h-[250px] md:h-[200px] relative">
              <Image
                src={tpl.src}
                alt={tpl.name}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain"
              />
            </div>
            <span className="text-center font-semibold mt-2">{tpl.name}</span>

            <div className="flex gap-2 mt-3 mb-3 w-full px-4">
              <button
                onClick={() => router.push(tpl.link)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold transition"
              >
                Live Preview
              </button>
              <button
                onClick={() => {
                  deviceId === null
                    ? alert("Anda belum login")
                    : router.push("/dashboard-user");
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold transition"
              >
                Pesan Sekarang
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Form */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <Dialog.Title className="text-lg font-bold mb-4">
              Pesan Template {selectedTemplate?.name}
            </Dialog.Title>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nama lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400"
              />
              <input
                type="email"
                placeholder="Email aktif"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Batal
              </button>
              <button
                onClick={handleOrder}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-70"
              >
                {loading ? "Mengirim..." : "Pesan"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
}
