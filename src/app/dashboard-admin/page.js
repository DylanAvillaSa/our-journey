"use client";

import React, { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "@/libs/config";
import { CheckCircle, XCircle, LogOut } from "lucide-react";

export default function DashboardAdmin() {
  const [pembelian, setPembelian] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeMenu, setActiveMenu] = useState("pembelian");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  const audioRef = useRef(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "pembelian"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // === Notifikasi realtime jika ada pesanan baru ===
      if (!firstLoad.current && data.length > pembelian.length) {
        audioRef.current?.play(); // play sound
      }
      firstLoad.current = false;

      setPembelian(data);
    });

    const unsub2 = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [pembelian.length]);

  // ==== FILTER & SEARCH ====
  useEffect(() => {
    let data = pembelian;

    if (search.trim() !== "") {
      data = data.filter(
        (d) =>
          d.nama_user?.toLowerCase().includes(search.toLowerCase()) ||
          d.email?.toLowerCase().includes(search.toLowerCase()) ||
          d.paket?.toLowerCase().includes(search.toLowerCase()) ||
          d.template?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterStatus !== "semua") {
      data = data.filter(
        (d) => d.status_pembayaran?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    setFilteredData(data);
  }, [search, filterStatus, pembelian]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  const handleAcc = async (data) => {
    await updateDoc(doc(db, "pembelian", data.id), {
      status: "aktif",
      status_pembayaran: "lunas",
      updated_at: new Date(),
    });
  };

  const handleReject = async (data) => {
    await updateDoc(doc(db, "pembelian", data.id), {
      status: "ditolak",
      status_pembayaran: "tidak valid",
      updated_at: new Date(),
    });
  };

  const badgeStyle = (status) => {
    if (status === "lunas") return "bg-green-100 text-green-700";
    if (status === "menunggu verifikasi admin")
      return "bg-yellow-100 text-yellow-700";
    if (status === "tidak valid") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <audio ref={audioRef} src="/notif.mp3" preload="auto" /> */}

      {/* ==== NAVBAR ==== */}
      <div className="bg-white shadow sticky top-0 z-50 flex items-center justify-between px-6 py-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Ismed Novian 👷‍♂️
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-xl transition font-semibold"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* ==== NAV MENU ==== */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          className={`px-5 py-2 rounded-xl font-semibold ${
            activeMenu === "pembelian"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border"
          }`}
          onClick={() => setActiveMenu("pembelian")}
        >
          Pembelian
        </button>
        <button
          className={`px-5 py-2 rounded-xl font-semibold ${
            activeMenu === "users"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border"
          }`}
          onClick={() => setActiveMenu("users")}
        >
          User Terdaftar
        </button>
      </div>

      {/* ======== PEMBELIAN ======== */}
      {activeMenu === "pembelian" && (
        <>
          {/* ==== SEARCH & FILTER ==== */}
          <div className="flex flex-col md:flex-row gap-3 items-center px-6 mt-6">
            <input
              type="text"
              placeholder="Cari nama, email, paket, template..."
              className="w-full md:flex-1 px-4 py-2 rounded-xl border shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="px-4 py-2 rounded-xl border shadow-sm bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="semua">Semua Status</option>
              <option value="menunggu verifikasi admin">
                Menunggu Verifikasi
              </option>
              <option value="lunas">Lunas</option>
              <option value="tidak valid">Ditolak</option>
            </select>
          </div>

          {/* ==== LIST CARD ==== */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 p-10 rounded-2xl bg-white shadow border">
                Tidak ada data cocok.
              </div>
            ) : (
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl shadow-lg border border-gray-200 bg-white p-5 hover:shadow-xl transition ${
                    !item.viewed ? "ring ring-green-400" : ""
                  }`}
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    {item.nama_user}
                  </h2>

                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p>Email: {item.email}</p>
                    <p>Paket: {item.paket}</p>
                    <p>Template: {item.template}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle(
                        item.status_pembayaran
                      )}`}
                    >
                      {item.status_pembayaran}
                    </span>
                  </div>

                  {item.bukti_transfer && (
                    <img
                      src={item.bukti_transfer}
                      className="rounded-xl w-full h-52 object-cover border mb-4 shadow-sm"
                    />
                  )}

                  {item.status_pembayaran === "menunggu verifikasi admin" && (
                    <div className="flex gap-3 w-full">
                      <button
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition text-white rounded-xl py-2 font-semibold"
                        onClick={() => handleAcc(item)}
                      >
                        <CheckCircle size={18} /> ACC
                      </button>

                      <button
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition text-white rounded-xl py-2 font-semibold"
                        onClick={() => handleReject(item)}
                      >
                        <XCircle size={18} /> Tolak
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ==== USERS ==== */}
      {activeMenu === "users" && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.length === 0 && (
            <div className="col-span-full text-center text-gray-500 p-10 rounded-2xl bg-white shadow border">
              Tidak ada user terdaftar.
            </div>
          )}

          {users.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl shadow-lg border border-gray-200 bg-white p-5 hover:shadow-xl transition"
            >
              <h2 className="text-lg font-bold text-gray-900">{item.nama}</h2>
              <p className="text-sm text-gray-700 mb-1">Email: {item.email}</p>
              {item.no_wa && (
                <p className="text-sm text-gray-700">No WA: {item.no_wa}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
