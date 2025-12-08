"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/libs/config";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { templatesMap } from "@/app/template/[templateId]/page";

export default function PreviewUndanganPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [TemplateComponent, setTemplateComponent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "pembelian", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const result = docSnap.data();
          setData(result);

          // Ambil template key dari Firestore dan normalize
          let rawKey = result.link_template; // misal: "/template/template-11-gold"
          let templateKey = rawKey?.trim().toLowerCase() || "";

          // Hapus '/template/' prefix jika ada
          if (templateKey.startsWith("/template/")) {
            templateKey = templateKey.replace("/template/", "");
          }

          const Component = templatesMap[templateKey] || null;
          if (!Component)
            console.warn("TemplateComponent tidak ditemukan di templatesMap!");
          setTemplateComponent(() => Component);
        } else {
          alert("Data undangan tidak ditemukan");
          router.push("/");
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  if (loading)
    return (
      <p className="text-center mt-12 text-green-800 animate-pulse">
        Memuat preview undangan...
      </p>
    );

  if (!data)
    return (
      <p className="text-center mt-12 text-red-500">Data tidak ditemukan.</p>
    );

  const mempelai = data.dataMempelai || data.formData || {};

  const status = data.status || "belum_dibayar";

  const handleCopyLink = () => {
    const link = `${window.location.origin}/undangan/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto shadow-2xl rounded-2xl overflow-hidden bg-white"
      >
        <div>
          {TemplateComponent ? (
            <TemplateComponent id={id} data={mempelai} previewMode={true} />
          ) : (
            <p className="text-center text-gray-500 py-10">
              Template tidak ditemukan.
            </p>
          )}
        </div>

        <div className="p-6 text-center border-t space-y-4">
          {status === "menunggu pembayaran" && (
            <>
              <p className="text-gray-600">
                Untuk dapat membagikan undangan, silakan selesaikan pembayaran
                terlebih dahulu 💳
              </p>
              <button
                onClick={() => router.push(`/pembayaran/${id}`)}
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition duration-300"
              >
                Lanjut ke Pembayaran 💰
              </button>
            </>
          )}

          {status === "aktif" && (
            <>
              <p className="text-green-700 font-medium">
                Undangan kamu sudah aktif 🎉
              </p>
              <button
                onClick={handleCopyLink}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition duration-300"
              >
                {copied ? "✅ Link Disalin!" : "📤 Bagikan Undangan"}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                {`${window.location.origin}/undangan/${id}`}
              </p>
            </>
          )}

          {status !== "aktif" && status !== "menunggu_pembayaran" && (
            <p className="text-gray-500 italic">
              Status: {status.replace("_", " ")}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
