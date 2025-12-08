"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/libs/config";
import { doc, getDocs, collection, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

const Preview = ({ activeMenu, user }) => {
  const [pembelianList, setPembelianList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDocs = async () => {
      if (!user) return;

      const q = query(
        collection(db, "pembelian"),
        where("email", "==", user.email)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setPembelianList(data);
      } else {
        console.log("❌ Tidak ada pembelian ditemukan.");
      }
    };

    fetchUserDocs();
  }, [user]);

  if (activeMenu !== "preview") return null;

  if (!pembelianList.length)
    return <p className="text-center mt-6 text-gray-500">Memuat undangan...</p>;

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-3xl font-bold text-teal-700 text-center mb-6">
        👀 Preview Semua Undangan
      </h1>

      {pembelianList.map((item, index) => (
        <div
          key={item.id}
          className="bg-white shadow-lg rounded-2xl p-5 mb-10 border border-teal-100"
        >
          <h2 className="text-2xl font-semibold text-teal-700 mb-4">
            Template {index + 1}: {item.template}
          </h2>

          {/* BUTTON LIHAT PREVIEW */}
          <div className="flex justify-center">
            <button
              onClick={() => router.push(`/preview-edit-template/${item.id}`)}
              className="bg-teal-600 text-white px-5 py-2 rounded-lg shadow hover:bg-teal-700"
            >
              Lihat Preview & Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Preview;
