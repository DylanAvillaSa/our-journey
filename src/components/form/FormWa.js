"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const FormWa = ({ paket }) => {
  // Form WA
  const [name, setName] = useState(paket?.name);
  const [partnerName, setPartnerName] = useState("");
  const [paketOrder, setPaketOrder] = useState("Silver");

  const sendWA = () => {
    const message = `Halo, saya ingin memesan undangan digital.\nNama Pemesan: ${name}\nNama Pasangan: ${partnerName}\nPaket: ${paketOrder}`;
    const waLink = `https://wa.me/6281234567890?text=${encodeURIComponent(
      message
    )}`;
    window.open(waLink, "_blank");
  };

  return (
    <form className="px-6 md:px-24 py-20 bg-green-50 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col gap-6"
      >
        {" "}
        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center text-gray-800">
          Pesan Undangan Digital
        </h2>
        <p className="text-center text-gray-600">
          Isi form di bawah, kami akan menghubungi Anda via WhatsApp.
        </p>
        {/* Form Inputs */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nama Pemesan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <input
            type="text"
            placeholder="Nama Pasangan"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <select
            value={paketOrder}
            onChange={(e) => setPaketOrder(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>
        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={sendWA}
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg transition"
        >
          Kirim via WhatsApp
        </motion.button>
      </motion.div>
    </form>
  );
};

export default FormWa;
