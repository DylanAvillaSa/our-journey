"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { stories } from "@/components/paket/gold/LoveStory";
import { db } from "@/libs/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { THEMES_BY_TEMPLATE } from "@/config/themesConfig";
import UploadSection from "@/components/paket/gold/UploadGambarSection";

const packages = [
  {
    name: "Silver",
    price: { original: "Rp 70.000", promo: "Rp 49.000" },
    features: [
      "Tampilan lebih elegan",
      "Jumlah undangan unlimited",
      "Ucapan dan Doa",
      "Template (2)",
      "Countdown",
      "Amplop Digital",
      "Musik",
    ],
    color: "border-gray-400 text-gray-700",
    bg: "bg-gray-50",
  },
  {
    name: "Gold",
    price: { original: "Rp 150.000", promo: "Rp 99.000" },
    features: [
      "Video",
      "Love Story",
      "Story Instagram",
      "Ucapan dan Doa",
      "Countdown",
      "Photo Slider (2)",
      "Custom Tema",
      "Gallery",
      "Variasi warna (3)",
      "Photo Gallery (8)",
      "Amplop Digital",
      "Musik",
    ],
    color: "border-yellow-500 text-yellow-700",
    bg: "bg-yellow-50",
  },
  {
    name: "Platinum",
    price: { original: "Rp 200.000", promo: "Rp 159.000" },
    features: [
      "Video",
      "Love Story",
      "Story Instagram",
      "Gallery",
      "Ucapan dan Doa",
      "Countdown",
      "Photo Slider (2)",
      "Custom Tema",
      "Variasi warna (3)",
      "Photo Gallery (8)",
      "Link Streaming",
      "Amplop Digital",
      "Instagram",
      "Musik",
      "Desain eksklusif",
      "Ucapan Melalui Video",
    ],
    color: "border-rose-500 text-rose-700",
    bg: "bg-rose-50",
  },
];

export default function FormPemesananPage() {
  const params = useParams();
  const id = params["id-pembelian"];
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isBacksoundUploaded, setIsBacksoundUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoadingPemesanan, setIsLoadingPemesanan] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "pembelian", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const pkg =
            packages.find((pkg) => pkg.name === data.paket) || packages[0];
          setSelectedPackage(pkg);

          // 🟢 SET TEMPLATE DI FORMDATA biar dropdown muncul
          setFormData((prev) => ({
            ...prev,
            template: data.template || pkg.paket, // misal simpan template = nama paket
          }));
        } else {
          alert("Data pembelian tidak ditemukan.");
          router.push("/");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🔥 Submit → simpan data ke Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingPemesanan(true);

    try {
      const docRef = doc(db, "pembelian", id);
      await updateDoc(docRef, {
        dataMempelai: formData,
        status: "menunggu pembayaran",
        updated_at: serverTimestamp(),
      });

      alert("Data berhasil disimpan! 🎉");
      router.push(`/preview-undangan/${id}`);
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoadingPemesanan(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
          💌 Form Pengisian Data Mempelai
        </h1>

        {/* Info Paket */}
        {selectedPackage && (
          <div className="mt-2 flex flex-col items-center justify-center gap-2">
            <span className="text-green-700 font-bold text-2xl">
              {selectedPackage?.price.promo}
            </span>
            <span className="text-gray-500 line-through text-lg">
              {selectedPackage?.price.original}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Informasi Dasar --- */}
          <h2 className="font-semibold text-xl text-center mt-2 text-green-700 mb-4">
            📋 Data Pemesan <br /> ({selectedPackage?.name} Package)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="panggilanWanita"
              placeholder="Nama Panggilan Mempelai Wanita"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
            <input
              name="namaLengkapWanita"
              placeholder="Nama Lengkap Mempelai Wanita"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
            <input
              name="panggilanPria"
              placeholder="Nama Panggilan Mempelai Pria"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
            <input
              name="namaLengkapPria"
              placeholder="Nama Lengkap Mempelai Pria"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />

            <input
              name="ayahMempelaiPria"
              placeholder="Nama Ayah Mempelai Pria"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />

            <input
              name="ibuMempelaiPria"
              placeholder="Nama Ibu Mempelai Pria"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />

            <input
              name="ayahMempelaiWanita"
              placeholder="Nama Ayah Mempelai Wanita"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />

            <input
              name="ibuMempelaiWanita"
              placeholder="Nama Ibu Mempelai Wanita"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
          </div>

          {/* --- Tanggal & Lokasi --- */}
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              📅 Tanggal & Lokasi Acara
            </h2>

            {/* --- Countdown Date --- */}
            <label className="text-sm font-medium text-gray-700">
              Countdown Tanggal
            </label>
            <input
              type="date"
              name="countdownDate"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full mb-3"
            />

            {/* --- Countdown Time --- */}
            <label className="text-sm font-medium text-gray-700">
              Countdown Waktu Mulai
            </label>
            <input
              type="time"
              name="countdownTime"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full mb-3"
            />

            {/* --- Tanggal Akad --- */}
            <label className="text-sm font-medium text-gray-700">
              Tanggal Akad
            </label>
            <input
              type="date"
              name="tanggalAkad"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full mb-4"
            />

            {/* --- Jam Akad --- */}
            <label className="text-sm font-medium text-gray-700">
              Jam Akad
            </label>
            <input
              type="time"
              name="jamAkad"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full mb-4"
            />

            {/* --- Tanggal Resepsi --- */}
            <label className="text-sm font-medium text-gray-700">
              Tanggal Resepsi
            </label>
            <input
              type="date"
              name="tanggalResepsi"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full mb-4"
            />

            {/* --- Jam Resepsi --- */}
            <label className="text-sm font-medium text-gray-700">
              Jam Resepsi
            </label>
            <input
              type="time"
              name="jamResepsi"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full mb-4"
            />

            {/* --- Lokasi Lengkap --- */}
            <textarea
              name="lokasiAkad"
              placeholder="Alamat Lengkap Lokasi Akad"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              rows={3}
            />

            {/* --- Maps Akad --- */}
            <input
              name="linkMaps"
              placeholder="Link Google Maps Lokasi Akad"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full mt-3"
            />

            {/* --- Lokasi Lengkap --- */}
            <textarea
              name="lokasiResepsi"
              placeholder="Alamat Lengkap Lokasi Resepsi"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full mt-5"
              rows={3}
            />

            {/* --- Maps Resepsi --- */}
            <input
              name="linkMapsResepsi"
              placeholder="Link Google Maps Lokasi Resepsi"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full mt-3"
            />
          </div>

          {/* Gallery */}
          {selectedPackage?.features.includes("Gallery") && (
            <UploadSection
              selectedPackage={selectedPackage}
              setFormData={setFormData}
            />
          )}

          {/* Instagram */}
          {selectedPackage?.features.includes("Instagram") && (
            <div>
              <input
                name="instagramMempelaiPria"
                placeholder="Instagram Mempelai Pria"
                onChange={handleChange}
                className="border p-3 rounded-lg w-full"
              />

              <input
                name="instagramMempelaiWanita"
                placeholder="Instagram Mempelai Wanita"
                onChange={handleChange}
                className="border p-3 rounded-lg w-full"
              />
            </div>
          )}

          {/* --- Fitur Tambahan Berdasarkan Paket --- */}
          {selectedPackage?.features.includes("Custom Tema") && (
            <div>
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                🎨 Tema Template
              </h2>

              {formData.template && THEMES_BY_TEMPLATE[formData.template] && (
                <div className="mb-3">
                  <label className="block text-gray-700 mb-2">
                    Pilih Tema Berdasarkan Template
                  </label>
                  <select
                    name="temaWarna"
                    onChange={handleChange}
                    className="border p-3 rounded-lg w-full"
                  >
                    <option value="">-- Pilih Tema --</option>
                    {Object.entries(THEMES_BY_TEMPLATE[formData.template]).map(
                      ([key, theme]) => (
                        <option key={key} value={key}>
                          {theme.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
            </div>
          )}

          {selectedPackage?.features.includes("Love Story") && (
            <div>
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                ❣ Love Story
              </h2>

              {(formData.loveStory?.length ? formData.loveStory : stories).map(
                (story, index) => (
                  <div
                    key={index}
                    className="mb-4 border p-3 rounded-lg bg-green-50 relative"
                  >
                    {/* Hapus */}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          loveStory: (prev.loveStory || stories).filter(
                            (_, i) => i !== index
                          ),
                        }));
                      }}
                      className="absolute top-2 right-2 text-red-500 font-bold"
                    >
                      ✕
                    </button>

                    <h3 className="font-semibold text-green-700 mb-2">
                      {story.title || `Story ${index + 1}`} ({story.when})
                    </h3>

                    {/* Tahun */}
                    <input
                      type="text"
                      value={story.when}
                      onChange={(e) => {
                        const newData = [...(formData.loveStory || stories)];
                        newData[index] = {
                          ...newData[index],
                          when: e.target.value,
                        };
                        setFormData((prev) => ({
                          ...prev,
                          loveStory: newData,
                        }));
                      }}
                      className="border p-2 rounded w-full mb-2"
                      placeholder="Tahun / Waktu"
                    />

                    {/* Cerita */}
                    <textarea
                      value={story.text}
                      onChange={(e) => {
                        const newData = [...(formData.loveStory || stories)];
                        newData[index] = {
                          ...newData[index],
                          text: e.target.value,
                        };
                        setFormData((prev) => ({
                          ...prev,
                          loveStory: newData,
                        }));
                      }}
                      className="border p-2 rounded w-full"
                      rows={3}
                      placeholder="Ceritakan momen ini..."
                    />
                  </div>
                )
              )}

              {/* Tambah Love Story */}
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    loveStory: [
                      ...(prev.loveStory?.length ? prev.loveStory : stories),
                      { title: "Story Baru", when: "", text: "" },
                    ],
                  }));
                }}
                className="px-3 py-2 bg-green-600 text-white rounded-lg"
              >
                + Tambah Cerita
              </button>
            </div>
          )}

          {selectedPackage?.features.includes("Amplop Digital") && (
            <div>
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                💰 Amplop Digital
              </h2>

              {(formData.rekening || [{ bank: "", nomor: "", nama: "" }]).map(
                (rek, index) => {
                  const bank = rek?.bank || "";
                  const nomor = rek?.nomor || "";
                  const nama = rek?.nama || "";

                  return (
                    <div
                      key={index}
                      className="border p-4 rounded-lg bg-green-50 mb-4 relative"
                    >
                      {/* Hapus rekening */}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              rekening: (prev.rekening || []).filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                          className="absolute top-2 right-2 text-red-500 font-bold"
                        >
                          ✕
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Bank */}
                        <select
                          value={bank}
                          onChange={(e) => {
                            const newData = [...(formData.rekening || [])];
                            newData[index] = {
                              ...newData[index],
                              bank: e.target.value,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              rekening: newData,
                            }));
                          }}
                          className="border p-3 rounded-lg w-full"
                        >
                          <option value="">-- Pilih Bank --</option>
                          <option value="BRI">BRI</option>
                          <option value="BCA">BCA</option>
                          <option value="BNI">BNI</option>
                          <option value="Mandiri">Mandiri</option>
                        </select>

                        {/* Nomor Rekening */}
                        <input
                          value={nomor}
                          onChange={(e) => {
                            const newData = [...(formData.rekening || [])];
                            newData[index] = {
                              ...newData[index],
                              nomor: e.target.value,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              rekening: newData,
                            }));
                          }}
                          placeholder="Nomor Rekening"
                          className="border p-3 rounded-lg w-full"
                        />

                        {/* Atas Nama */}
                        <input
                          value={nama}
                          onChange={(e) => {
                            const newData = [...(formData.rekening || [])];
                            newData[index] = {
                              ...newData[index],
                              nama: e.target.value,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              rekening: newData,
                            }));
                          }}
                          placeholder="Atas Nama"
                          className="border p-3 rounded-lg w-full"
                        />
                      </div>
                    </div>
                  );
                }
              )}

              {/* Tambah rekening */}
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    rekening: [
                      ...(prev.rekening || []),
                      { bank: "", nomor: "", nama: "" },
                    ],
                  }));
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg mb-3"
              >
                + Tambah Rekening
              </button>

              {/* Dompet Digital */}
              <input
                value={formData.dompetDigital || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dompetDigital: e.target.value,
                  }))
                }
                placeholder="Dompet Digital (DANA, OVO, ShopeePay)"
                className="border p-3 rounded-lg w-full mt-3"
              />
            </div>
          )}

          {selectedPackage?.features.includes("Musik") && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                🎵 Upload Backsound Musik
              </h2>

              <input
                type="file"
                accept="audio/mp3,audio/mpeg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("upload_preset", "backsound_unsigned");

                  // State upload dimulai
                  setIsUploading(true);
                  setIsBacksoundUploaded(false);
                  setUploadProgress(0);

                  const xhr = new XMLHttpRequest();

                  xhr.upload.addEventListener("progress", (event) => {
                    if (event.lengthComputable) {
                      const percent = Math.round(
                        (event.loaded * 100) / event.total
                      );
                      setUploadProgress(percent);
                    }
                  });

                  xhr.addEventListener("load", () => {
                    const response = JSON.parse(xhr.responseText);
                    if (response.secure_url) {
                      setFormData((prev) => ({
                        ...prev,
                        backsound: response.secure_url,
                      }));
                      setIsBacksoundUploaded(true);
                      alert("✅ Backsound berhasil diupload!");
                    } else {
                      alert("❌ Upload gagal bro 😢");
                    }
                    setIsUploading(false);
                  });

                  xhr.addEventListener("error", () => {
                    alert("⚠️ Upload error, coba lagi bro!");
                    setIsUploading(false);
                  });

                  xhr.open(
                    "POST",
                    "https://api.cloudinary.com/v1_1/dk5nnual8/video/upload"
                  );
                  xhr.send(formData);
                }}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-400"
              />

              {/* Progress Upload */}
              {isUploading && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-blue-600 mt-2">
                    {uploadProgress}% selesai
                  </p>
                </div>
              )}

              {isBacksoundUploaded && (
                <p className="text-sm text-green-700 mt-2">
                  ✅ Upload selesai!
                </p>
              )}
            </div>
          )}

          {selectedPackage?.features.includes("Link Streaming") && (
            <div>
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                📹 Link Streaming
              </h2>
              <input
                name="streaming"
                placeholder="Link Live Streaming (IG/YouTube)"
                onChange={handleChange}
                className="border p-3 rounded-lg w-full"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={
              !isBacksoundUploaded &&
              selectedPackage?.features.includes("Musik")
            }
            className={`${
              !isBacksoundUploaded &&
              selectedPackage?.features.includes("Musik")
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            } 
            ${isLoadingPemesanan && "opacity-35"}
            text-white font-bold py-3 px-8 rounded-xl shadow-lg transition duration-300`}
          >
            {isUploading
              ? "Mengupload backsound..."
              : !isBacksoundUploaded &&
                selectedPackage?.features.includes("Musik")
              ? "Upload backsound dulu 🎵"
              : "Kirim Pemesanan 📲"}
          </button>
        </form>
      </div>
    </div>
  );
}
