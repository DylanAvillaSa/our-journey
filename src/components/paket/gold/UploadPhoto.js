"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function UploadFoto() {
  // STATE TERPISAH
  const [fotoSampul, setFotoSampul] = useState(null);
  const [fotoSampulPreview, setFotoSampulPreview] = useState(null);
  const [progressSampul, setProgressSampul] = useState(0);

  const [fotoPria, setFotoPria] = useState(null);
  const [fotoPriaPreview, setFotoPriaPreview] = useState(null);
  const [progressPria, setProgressPria] = useState(0);

  const [fotoWanita, setFotoWanita] = useState(null);
  const [fotoWanitaPreview, setFotoWanitaPreview] = useState(null);
  const [progressWanita, setProgressWanita] = useState(0);

  // SIMULASI UPLOAD
  const fakeUpload = (setter) => {
    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setter(value);
      if (value >= 100) clearInterval(interval);
    }, 200);
  };

  const handleUpload = (e, setFile, setPreview, setProgress) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    setPreview(URL.createObjectURL(file));
    setProgress(0);

    // Simulate upload progress
    fakeUpload(setProgress);
  };

  return (
    <div className="space-y-8 p-4">
      {/* ================== FOTO SAMPUL ================== */}
      <div>
        <label className="font-semibold">Foto Sampul</label>
        <input
          type="file"
          className="block mt-2"
          onChange={(e) =>
            handleUpload(
              e,
              setFotoSampul,
              setFotoSampulPreview,
              setProgressSampul
            )
          }
        />

        {/* Progress hanya muncul jika upload berjalan */}
        {progressSampul > 0 && progressSampul < 100 && (
          <div className="w-full bg-gray-200 rounded h-2 mt-3">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${progressSampul}%` }}
            ></div>
          </div>
        )}

        {/* Preview muncul kalau sudah ada gambar */}
        {fotoSampulPreview && (
          <Image
            src={fotoSampulPreview}
            alt="Preview Sampul"
            width={300}
            height={200}
            className="mt-4 rounded"
          />
        )}
      </div>

      {/* ================== FOTO MEMPELAI PRIA ================== */}
      <div>
        <label className="font-semibold">Foto Mempelai Pria</label>
        <input
          type="file"
          className="block mt-2"
          onChange={(e) =>
            handleUpload(e, setFotoPria, setFotoPriaPreview, setProgressPria)
          }
        />

        {progressPria > 0 && progressPria < 100 && (
          <div className="w-full bg-gray-200 rounded h-2 mt-3">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${progressPria}%` }}
            ></div>
          </div>
        )}

        {fotoPriaPreview && (
          <Image
            src={fotoPriaPreview}
            alt="Preview Pria"
            width={300}
            height={200}
            className="mt-4 rounded"
          />
        )}
      </div>

      {/* ================== FOTO MEMPELAI WANITA ================== */}
      <div>
        <label className="font-semibold">Foto Mempelai Wanita</label>
        <input
          type="file"
          className="block mt-2"
          onChange={(e) =>
            handleUpload(
              e,
              setFotoWanita,
              setFotoWanitaPreview,
              setProgressWanita
            )
          }
        />

        {progressWanita > 0 && progressWanita < 100 && (
          <div className="w-full bg-gray-200 rounded h-2 mt-3">
            <div
              className="bg-pink-500 h-2 rounded"
              style={{ width: `${progressWanita}%` }}
            ></div>
          </div>
        )}

        {fotoWanitaPreview && (
          <Image
            src={fotoWanitaPreview}
            alt="Preview Wanita"
            width={300}
            height={200}
            className="mt-4 rounded"
          />
        )}
      </div>
    </div>
  );
}
