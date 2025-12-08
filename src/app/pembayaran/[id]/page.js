"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/libs/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function PembayaranPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [buktiTransfer, setBuktiTransfer] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Ambil data pembelian
  useEffect(() => {
    const fetchPembelian = async () => {
      const docRef = doc(db, "pembelian", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setData(snap.data());
        if (snap.data().bukti_transfer) {
          setUploadedUrl(snap.data().bukti_transfer);
        }
      }
    };
    fetchPembelian();
  }, [id]);

  // 🔹 File input handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // validasi ukuran file < 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("❌ Ukuran file maksimal 5MB!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBuktiTransfer(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Upload bukti transfer
  const handleUploadBukti = async () => {
    if (uploadedUrl) {
      alert("⚠️ Bukti transfer sudah diupload, tidak bisa upload ulang!");
      return;
    }

    if (!buktiTransfer)
      return alert("Pilih file bukti transfer terlebih dahulu!");

    setLoading(true);
    try {
      const formData = new FormData();
      const fileInput = document.querySelector('input[type="file"]');
      const file = fileInput.files[0];
      formData.append("file", file);

      const res = await fetch("/api/bukti-transfer", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        // simpan ke firestore
        const docRef = doc(db, "pembelian", id);
        await updateDoc(docRef, {
          bukti_transfer: data.url,
        });

        setUploadedUrl(data.url);
        alert("✅ Bukti transfer berhasil diupload!");
      } else {
        alert("❌ Upload gagal ke Cloudinary.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan bukti transfer.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Konfirmasi pembayaran ke admin
  const handleKonfirmasiPembayaran = async () => {
    if (!uploadedUrl) return alert("Upload bukti transfer terlebih dahulu!");

    setLoading(true);
    try {
      const docRef = doc(db, "pembelian", id);
      await updateDoc(docRef, {
        status_pembayaran: "menunggu verifikasi admin", //
        idPembelian: id,
      });

      alert("✅ Pembayaran dikirim! Menunggu verifikasi admin.");
      router.push("/dashboard-user");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal mengirim konfirmasi pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <p className="text-center mt-10">Memuat data...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-green-800 mb-6">
          💰 Pembayaran Paket {data.paket}
        </h1>

        <p className="text-gray-600 mb-4">
          Silakan transfer ke rekening berikut sesuai harga paket:
        </p>

        <div className="border-2 border-green-200 rounded-lg p-4 mb-6">
          <p>
            <strong>Bank:</strong> BCA
          </p>
          <p>
            <strong>No Rek:</strong> 1481060031
          </p>
          <p>
            <strong>Atas Nama:</strong> Muhammad Ismed Novian
          </p>
          <p>
            <strong>Nominal:</strong>{" "}
            <span className="font-semibold text-green-700">{data.harga}</span>
          </p>
        </div>

        {/* Upload Bukti Transfer */}
        <div className="mb-6">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            disabled={!!uploadedUrl}
            className="text-sm"
          />
          <button
            onClick={handleUploadBukti}
            disabled={loading || !!uploadedUrl}
            className={`ml-3 ${
              uploadedUrl
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded-xl transition duration-300`}
          >
            {loading ? "Mengupload..." : "Upload Bukti Transfer"}
          </button>
          {uploadedUrl && (
            <p className="text-sm text-green-700 mt-2">
              ✅ Bukti sudah diupload, tidak bisa upload ulang.
            </p>
          )}
        </div>

        {/* Preview bukti transfer */}
        {uploadedUrl && (
          <div className="mb-6">
            <p className="text-green-700 font-medium mb-2">
              Bukti Transfer Terupload:
            </p>
            {uploadedUrl.startsWith("data:application/pdf") ? (
              <a
                href={uploadedUrl}
                target="_blank"
                className="text-blue-600 underline"
              >
                📄 Lihat Bukti PDF
              </a>
            ) : (
              <img
                src={uploadedUrl}
                alt="Bukti Transfer"
                className="mx-auto rounded-lg max-h-60"
              />
            )}
          </div>
        )}

        {/* Tombol Konfirmasi */}
        <button
          onClick={handleKonfirmasiPembayaran}
          disabled={!uploadedUrl || loading}
          className={`${
            uploadedUrl
              ? "bg-green-700 hover:bg-green-800"
              : "bg-gray-300 cursor-not-allowed"
          } text-white font-bold py-3 px-8 rounded-xl shadow-lg transition duration-300`}
        >
          {loading ? "Memproses..." : "Konfirmasi Pembayaran 📤"}
        </button>
      </div>
    </div>
  );
}
