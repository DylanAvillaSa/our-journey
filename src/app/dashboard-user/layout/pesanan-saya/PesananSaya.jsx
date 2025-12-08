"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Clock,
  XCircle,
  FileEdit,
  CreditCard,
  Eye,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PesananSaya = ({ purchases = [], templates = [] }) => {
  if (purchases.length === 0)
    return (
      <div className="text-center py-24">
        <p className="text-gray-600 text-lg">
          Belum ada pesanan. Yuk pilih template dulu ✨
        </p>
      </div>
    );

  const router = useRouter();

  // ==========================================================
  // 🔥 FIX UTAMA: Cari template dari Silver / Gold / Platinum
  // ==========================================================
  const findImageSrc = (item) => {
    if (!item || templates.length === 0) return "/default-template.png";

    // Data templates sekarang = [{ Silver: [], Gold: [], Platinum: [] }]
    const allCategories = templates[0];

    let found = null;

    // Loop setiap kategori
    for (const categoryName in allCategories) {
      const categoryList = allCategories[categoryName];

      const match = categoryList.find((t) => {
        // Match berdasarkan:
        return (
          t.href?.toLowerCase() === item.link_template?.toLowerCase() ||
          t.name?.toLowerCase() === item.template?.toLowerCase()
        );
      });

      if (match) {
        found = match;
        break;
      }
    }

    return found?.src || "/default-template.png";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6"
    >
      {purchases.map((item, index) => {
        const imgSrc = findImageSrc(item);

        return (
          <motion.div
            key={item.id || index}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
          >
            {/* Gambar */}
            <div className="w-full h-[220px] sm:h-[250px] md:h-[200px] relative bg-gray-50">
              <Image
                src={imgSrc}
                alt={item.template}
                fill
                className="object-contain"
              />
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-3">
              <h3 className="font-semibold text-gray-800 text-lg">
                {item.template}
              </h3>
              <p className="text-sm text-gray-500">
                Paket:{" "}
                <span className="font-medium text-teal-600">{item.paket}</span>
              </p>

              {/* Status */}
              <div className="flex items-center gap-2 text-sm">
                {item.status === "aktif" && (
                  <>
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Aktif</span>
                  </>
                )}
                {item.status === "menunggu_verifikasi_admin" && (
                  <>
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-600 font-medium">
                      Menunggu Verifikasi
                    </span>
                  </>
                )}
                {item.status === "ditolak" && (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-medium">Ditolak</span>
                  </>
                )}
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-col gap-2 mt-2">
                {/* Step 1: Isi Form */}
                {item.status === "aktif" &&
                  !item.form_filled &&
                  item.status_pembayaran !== "lunas" && (
                    <Link
                      href={`/form-pemesanan/${item.id}`}
                      className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-all"
                    >
                      <FileEdit size={18} />
                      Isi Form Undangan
                    </Link>
                  )}

                {/* Step 2: Preview Template */}
                {item.form_filled && (
                  <a
                    href={item.link_template}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg transition-all"
                  >
                    <Eye size={18} />
                    Preview Undangan
                  </a>
                )}

                {/* Step 3: Lanjutkan Pembayaran */}
                {/* {item.form_filled ||
                  (item.status_pembayaran === "menunggu pembayaran" && (
                    <Link
                      href={`/pembayaran/${item.id}`}
                      className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-all"
                    >
                      <CreditCard size={18} />
                      Lanjutkan Pembayaran
                    </Link>
                  ))} */}

                {item.form_filled ||
                  (item.status_pembayaran === "menunggu verifikasi admin" && (
                    <Link
                      href={`/pembayaran/${item.id}`}
                      className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-all"
                    >
                      <CreditCard size={18} />
                      Menunggu verifikasi admin
                    </Link>
                  ))}

                {/* Step 4: Share Link */}
                {item.status_pembayaran === "lunas" && (
                  <div className="flex flex-col w-full gap-4 text-sm">
                    <button
                      onClick={() =>
                        router.push(`template-pembeli/${item.idPembelian}`)
                      }
                      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-all"
                    >
                      <Share2 size={18} />
                      Lihat Template
                    </button>

                    <button
                      onClick={() =>
                        window.open(
                          `https://wa.me/?text=Yuk%20lihat%20undangan%20kami%20💌:%20${window.location.origin}/template-pembeli/${item?.idPembelian}`,
                          "_blank"
                        )
                      }
                      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-all"
                    >
                      <Share2 size={18} />
                      Share ke WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default PesananSaya;
