"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Bell, LogIn } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/libs/config";
import { onSnapshot, collection, doc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [notif, setNotif] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [user, setUser] = useState(null);
  const notifRef = useRef(null);

  const auth = getAuth();

  // 🔥 Pantau user login/logout realtime
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubAuth();
  }, [auth]);

  // 🔥 Ambil data pembelian realtime milik user
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(collection(db, "pembelian"), (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((d) => d.email === user.email); // 🔒 Hanya milik user ini
      setNotif(data);
    });

    return () => unsub();
  }, [user]);

  // 🔔 Klik notifikasi → langsung ke form
  const handleNotifClick = async (n) => {
    const docRef = doc(db, "pembelian", n.id);

    // Update notif_seen biar gak muncul terus
    if (!n.notif_seen) {
      await updateDoc(docRef, { notif_seen: true });
    }

    if (n.link_form && n.link_form !== "undefined") {
      router.push(`/form-pemesanan/${n.id}`);
    } else {
      alert("Form pemesanan belum tersedia. Coba ulangi beberapa saat lagi.");
    }
  };

  // 🌫️ Efek shadow saat scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup dropdown notif saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ❌ Hide navbar di halaman tertentu
  if (
    pathname.startsWith("/template/") ||
    pathname.startsWith("/form-pemesanan/") ||
    pathname.startsWith("/preview-undangan") ||
    pathname.startsWith("/pembayaran") ||
    pathname.startsWith("/template-pembeli") ||
    pathname.startsWith("/preview-edit-template") ||
    pathname === "/dashboard-admin" ||
    pathname === "/dashboard-user" ||
    pathname === "/login" ||
    pathname === "/login-user" ||
    pathname === "/register" ||
    pathname === "/share-to"
  ) {
    return null;
  }

  const unreadCount = notif.filter((n) => !n.notif_seen).length;

  // 🔑 Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg bg-white/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center h-20">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Image
            src="/logo/logo-our-journey.png"
            alt="Logo"
            width={50}
            height={50}
            priority
            className="w-auto h-auto"
          />
          <span className="font-bold text-xl text-gray-800">Our Journey</span>
        </div>

        {/* 🔔 Notifikasi atau Login */}
        <div className="relative flex items-center gap-4" ref={notifRef}>
          {!user ? (
            <button
              onClick={() => router.push("/login-user")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition font-semibold"
            >
              <LogIn size={18} />
              Masuk
            </button>
          ) : (
            <>
              {/* Tombol logout */}
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-500 hover:text-red-600 transition"
              >
                Keluar
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
