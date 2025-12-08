"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, CreditCard, ExternalLink } from "lucide-react";

const Pembayaran = ({ activeMenu, purchases }) => {
  if (activeMenu !== "pembayaran") return null;
  const router = useRouter();

  return (
    <motion.div
      className="p-4 sm:p-6 text-gray-700"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-teal-700 mb-1">
          💳 Pembayaran Kamu
        </h3>
        <p className="text-gray-500 text-sm">
          Lihat status pembayaran dan akses link template undanganmu.
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="mx-auto text-gray-400 w-12 h-12 mb-3" />
          <p className="text-gray-500">Belum ada pembelian yang tercatat.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {purchases.map((p) => (
            <motion.div
              key={p.id}
              className="rounded-2xl border border-gray-200 shadow-sm bg-white p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center transition hover:shadow-md"
              whileHover={{ scale: 1.01 }}
            >
              {/* Info Paket */}
              <div className="flex items-start gap-4 w-full sm:w-auto">
                <div className="bg-teal-100 text-teal-600 rounded-full p-3">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-teal-800 mb-1">
                    {p.paket}
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    Pembayaran:{" "}
                    <span
                      className={`font-medium ${
                        p.status_pembayaran === "lunas"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {p.status_pembayaran || "-"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="mt-4 sm:mt-0 sm:text-right w-full sm:w-auto">
                {p.status_pembayaran === "lunas" ? (
                  <a
                    href={`/template-pembeli/${p?.idPembelian}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:opacity-90 transition w-full sm:w-auto"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Lihat Template
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 bg-gray-200 text-gray-400 px-4 py-2 rounded-lg text-sm font-semibold w-full sm:w-auto cursor-not-allowed"
                  >
                    Menunggu Pembayaran
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Pembayaran;
