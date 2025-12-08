"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/libs/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { templatesMap } from "@/app/template/[templateId]/page";

export default function PreviewEditTemplatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [showEditor, setShowEditor] = useState(true);
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

  if (loading)
    return (
      <p className="text-center mt-12 text-green-800 animate-pulse">
        Memuat editor...
      </p>
    );

  if (!data)
    return (
      <p className="text-center mt-12 text-red-500">Data tidak ditemukan.</p>
    );

  // UPDATE REALTIME PREVIEW
  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      dataMempelai: {
        ...prev.dataMempelai,
        [field]: value,
      },
    }));
  };

  // SIMPAN KE FIRESTORE
  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "pembelian", id), {
        dataMempelai: data.dataMempelai,
      });

      alert("Berhasil menyimpan perubahan!");
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan perubahan!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 relative">
      {/* 💍 PREVIEW TEMPLATE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden"
      >
        {TemplateComponent ? (
          <div>
            <TemplateComponent id={id} data={mempelai} previewMode={true} />
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">
            Template tidak ditemukan
          </p>
        )}
      </motion.div>

      {/* ✏ EDITOR SIDEBAR */}
      {showEditor && (
        <div className="inset-0 bg-black/40 flex justify-end z-50">
          <div className="bg-white w-96 h-full p-6 shadow-xl overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-green-700">
              Edit Undangan
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-gray-600 font-medium">
                  Nama Pengantin Pria
                </label>
                <input
                  className="border p-3 rounded w-full"
                  value={mempelai.namaPria || ""}
                  onChange={(e) => handleChange("namaPria", e.target.value)}
                />
              </div>

              <div>
                <label className="text-gray-600 font-medium">
                  Nama Pengantin Wanita
                </label>
                <input
                  className="border p-3 rounded w-full"
                  value={mempelai.namaWanita || ""}
                  onChange={(e) => handleChange("namaWanita", e.target.value)}
                />
              </div>

              <div>
                <label className="text-gray-600 font-medium">
                  Tanggal Acara
                </label>
                <input
                  className="border p-3 rounded w-full"
                  value={mempelai.tanggalAcara || ""}
                  onChange={(e) => handleChange("tanggalAcara", e.target.value)}
                />
              </div>

              {/* Mau tambah field lain? tinggal tambah sini */}
            </div>

            <button
              onClick={handleSave}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded w-full"
            >
              💾 Simpan Perubahan
            </button>

            <button
              onClick={() => router.back()}
              className="mt-3 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded w-full"
            >
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
