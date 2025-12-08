"use client";

import React, { useState } from "react";

export default function UploadSection({ selectedPackage, setFormData }) {
  // FOTO SAMPUL
  const [fotoSampul, setFotoSampul] = useState([]);
  const [progressSampul, setProgressSampul] = useState([]);

  // FOTO PRIA
  const [fotoPria, setFotoPria] = useState([]);
  const [progressPria, setProgressPria] = useState([]);

  // FOTO WANITA
  const [fotoWanita, setFotoWanita] = useState([]);
  const [progressWanita, setProgressWanita] = useState([]);

  // GALLERY UTAMA
  const [gallery, setGallery] = useState([]);
  const [progressGallery, setProgressGallery] = useState([]);

  // ============================================
  // 🔥 UNIVERSAL UPLOADER + UPDATE FORM DATA
  // ============================================
  const uploadFiles = async (files, setUrls, setProgress, formKey) => {
    const maxPhotos =
      selectedPackage?.name === "Silver"
        ? 4
        : selectedPackage?.name === "Gold"
        ? 8
        : 12;

    if (files.length > maxPhotos) {
      alert(
        `⚠️ Maksimal ${maxPhotos} foto untuk paket ${selectedPackage?.name}`
      );
      return;
    }

    const uploaded = [];
    const progressList = Array(files.length).fill(0);
    setProgress([...progressList]);

    for (let i = 0; i < files.length; i++) {
      await new Promise((resolve) => {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("upload_preset", "gallery_unsigned");

        const xhr = new XMLHttpRequest();

        // PROGRESS BAR
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            progressList[i] = Math.round((event.loaded * 100) / event.total);
            setProgress([...progressList]);
          }
        });

        // SELESAI
        xhr.onload = () => {
          const data = JSON.parse(xhr.responseText);
          if (data.secure_url) uploaded.push(data.secure_url);
          resolve();
        };

        xhr.open(
          "POST",
          "https://api.cloudinary.com/v1_1/dk5nnual8/image/upload"
        );
        xhr.send(formData);
      });
    }

    // simpan ke state lokal
    setUrls(uploaded);

    // 🔥 masukkan ke formData supaya nanti bisa dikirim ke Firestore
    setFormData((prev) => ({
      ...prev,
      [formKey]: uploaded,
    }));
  };

  return (
    <div className="space-y-12">
      {/* ================= FOTO SAMPUL ================= */}
      <section>
        <h2 className="text-2xl font-semibold text-green-700 mb-3">
          🖼 Foto Sampul
        </h2>

        <input
          type="file"
          accept="image/*"
          multiple
          required
          className="border p-3 rounded-lg w-full"
          onChange={(e) =>
            uploadFiles(
              [...e.target.files],
              setFotoSampul,
              setProgressSampul,
              "fotoSampul" // masuk formData.fotoSampul
            )
          }
        />

        {progressSampul.map((p, i) => (
          <div key={i} className="mt-2">
            <p className="text-sm">
              Foto {i + 1}: {p}%
            </p>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="bg-blue-500 h-3 rounded"
                style={{ width: `${p}%` }}
              />
            </div>
          </div>
        ))}

        {fotoSampul.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {fotoSampul.map((url) => (
              <img
                key={url}
                src={url}
                className="h-32 w-full object-cover rounded"
              />
            ))}
          </div>
        )}
      </section>

      {/* ================= FOTO PRIA ================= */}
      <section>
        <h2 className="text-2xl font-semibold text-green-700 mb-3">
          🖼 Foto Mempelai Pria
        </h2>

        <input
          type="file"
          accept="image/*"
          multiple
          className="border p-3 rounded-lg w-full"
          onChange={(e) =>
            uploadFiles(
              [...e.target.files],
              setFotoPria,
              setProgressPria,
              "fotoMempelaiPria" // masuk formData.fotoPria
            )
          }
        />

        {progressPria.map((p, i) => (
          <div key={i} className="mt-2">
            <p className="text-sm">
              Foto {i + 1}: {p}%
            </p>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="bg-green-500 h-3 rounded"
                style={{ width: `${p}%` }}
              />
            </div>
          </div>
        ))}

        {fotoPria.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {fotoPria.map((url) => (
              <img
                key={url}
                src={url}
                className="h-32 w-full object-cover rounded"
              />
            ))}
          </div>
        )}
      </section>

      {/* ================= FOTO WANITA ================= */}
      <section>
        <h2 className="text-2xl font-semibold text-green-700 mb-3">
          🖼 Foto Mempelai Wanita
        </h2>

        <input
          type="file"
          accept="image/*"
          multiple
          className="border p-3 rounded-lg w-full"
          onChange={(e) =>
            uploadFiles(
              [...e.target.files],
              setFotoWanita,
              setProgressWanita,
              "fotoMempelaiWanita" // masuk formData.fotoWanita
            )
          }
        />

        {progressWanita.map((p, i) => (
          <div key={i} className="mt-2">
            <p className="text-sm">
              Foto {i + 1}: {p}%
            </p>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="bg-pink-500 h-3 rounded"
                style={{ width: `${p}%` }}
              />
            </div>
          </div>
        ))}

        {fotoWanita.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {fotoWanita.map((url) => (
              <img
                key={url}
                src={url}
                className="h-32 w-full object-cover rounded"
              />
            ))}
          </div>
        )}
      </section>

      {/* ================= GALLERY ================= */}
      <section>
        <h2 className="text-2xl text-green-700 font-semibold mb-3">
          🖼 Gallery Foto
        </h2>

        <input
          type="file"
          accept="image/*"
          multiple
          className="border p-3 rounded-lg w-full"
          onChange={(e) =>
            uploadFiles(
              [...e.target.files],
              setGallery,
              setProgressGallery,
              "gallery" // masuk formData.gallery
            )
          }
        />

        {progressGallery.map((p, i) => (
          <div key={i} className="mt-2">
            <p className="text-sm">
              Foto {i + 1}: {p}%
            </p>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="bg-purple-500 h-3 rounded"
                style={{ width: `${p}%` }}
              />
            </div>
          </div>
        ))}

        {gallery.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {gallery.map((url) => (
              <img
                key={url}
                src={url}
                className="h-32 w-full object-cover rounded"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
