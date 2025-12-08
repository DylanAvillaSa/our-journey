"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/libs/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  HomeIcon,
  EyeIcon,
  Share2Icon,
  CreditCardIcon,
  ShoppingCart,
  LogOutIcon,
  PackageCheckIcon,
  Menu,
  X,
} from "lucide-react";
import Dashboard from "./layout/dashboard/Dashboard";
import Preview from "./layout/preview/Preview";
import Share from "./layout/share-undangan/Share";
import Pembayaran from "./layout/pembayaran/Pembayaran";
import PesananSaya from "./layout/pesanan-saya/PesananSaya";

const allTemplates = {
  Silver: [1, 2, 3].map((i) => ({
    id: i,
    name: `Silver ${i}`,
    src: `/template/template-${i}.png`,
    link: `/template/template-${i}-silver`,
    paket: "Silver",
  })),
  Gold: [4, 5, 6, 8, 9, 10, 7, 12].map((i, idx) => ({
    id: i,
    name: `Gold ${idx + 1}`,
    src: `/template/template-${i}.png`,
    link:
      i === 7 ? "/template/template-11-gold" : `/template/template-${i}-gold`,
    paket: "Gold",
  })),
  Platinum: [13, 14, 15, 16].map((i, idx) => ({
    id: i,
    name: `Platinum ${idx + 1}`,
    src: `/template/template-${i}.png`,
    link: `/template/template-${i}-platinum`,
    paket: "Platinum",
  })),
};

const DashboardUser = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Silver");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [lastSubmit, setLastSubmit] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const templates = allTemplates[selectedCategory];

  // ✅ Cek user login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        listenUserPurchases(currentUser.email);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ✅ Realtime listener data pembelian user
  const listenUserPurchases = (email) => {
    const q = query(collection(db, "pembelian"), where("email", "==", email));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSelectedCategory(data[0]?.paket || "Silver");

      setPurchases(data);
    });
    return unsub;
  };

  useEffect(() => {
    if (selectedTemplate) {
      handleOrder();
    }
  }, [selectedTemplate]);

  // ✅ Fungsi kirim pesanan
  const handleOrder = async () => {
    if (!selectedTemplate) return toast.error("Pilih template dulu ya 😅");
    if (!user?.email) return toast.error("Silakan login dulu.");

    const now = Date.now();
    if (now - lastSubmit < 8000) {
      toast("⏳ Tunggu 8 detik sebelum kirim lagi ya.");
      return;
    }

    const menunggu = purchases.some(
      (p) =>
        p.status_pembayaran === "menunggu verifikasi admin" &&
        p.status === "aktif"
    );

    if (menunggu)
      return toast.error(
        "Masih ada pesanan aktif / menunggu verifikasi admin."
      );

    setLastSubmit(now);
    setLoading(true);

    try {
      await addDoc(collection(db, "pembelian"), {
        nama_user: user.displayName || "User",
        email: user.email,
        paket: selectedTemplate.paket,
        template: selectedTemplate.name,
        status: "aktif",
        status_pembayaran: "menunggu pembayaran",
        link_template: selectedTemplate.link,
        bukti_transfer: "",
        createdAt: serverTimestamp(),
      });

      toast.success("Pesanan berhasil dikirim. Lihat di keranjang 🙏");
      setSelectedTemplate(null);
    } catch (error) {
      console.error(error);
      toast.error("Gagal kirim pesanan. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const menus = [
    { id: "dashboard", name: "Dashboard", icon: HomeIcon },
    { id: "preview", name: "Preview Undangan", icon: EyeIcon },
    { id: "share", name: "Bagikan Undangan", icon: Share2Icon },
    { id: "pembayaran", name: "Pembayaran", icon: CreditCardIcon },
    { id: "pesanan_saya", name: "Pesanan Saya", icon: PackageCheckIcon },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading dashboard...
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold mb-4">Akses Ditolak</h2>
        <p>Silakan login terlebih dahulu untuk melihat dashboard.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      {/* 🧭 NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveMenu("dashboard")}
          >
            <Image
              src="/logo/logo-our-journey.png"
              alt="OurJourney"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1 className="text-xl font-bold text-teal-600">
              Our<span className="text-gray-700">Journey</span>
            </h1>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {menus.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMenu(m.id)}
                className={`flex items-center gap-2 text-sm transition-all ${
                  activeMenu === m.id
                    ? "text-teal-600 font-semibold"
                    : "text-gray-600 hover:text-teal-500"
                }`}
              >
                <m.icon className="w-5 h-5" />
                {m.name}
              </button>
            ))}
          </div>

          {/* Icons kanan */}
          <div className="flex items-center gap-4">
            {/* Keranjang */}
            <div
              onClick={() => setActiveMenu("pesanan_saya")}
              className="relative cursor-pointer"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-teal-600 transition" />
              {purchases.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {purchases.length}
                </span>
              )}
            </div>

            {/* Profile */}
            <div
              className="relative cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="User"
                  width={36}
                  height={36}
                  className="rounded-full border border-gray-200"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700">
                  {user.email[0].toUpperCase()}
                </div>
              )}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 bg-white shadow-lg rounded-lg p-3 w-44 border"
                  >
                    <p className="text-sm font-medium truncate mb-2">
                      {user.displayName || user.email}
                    </p>
                    <button
                      onClick={() => {
                        signOut(auth);
                        router.push("/");
                      }}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm"
                    >
                      <LogOutIcon className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger (Mobile) */}
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-7 h-7 text-gray-700" />
              ) : (
                <Menu className="w-7 h-7 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t shadow-sm"
            >
              <div className="flex flex-col p-4 space-y-3">
                {menus.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveMenu(m.id);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 text-base py-2 rounded-lg transition ${
                      activeMenu === m.id
                        ? "text-teal-600 font-semibold bg-teal-50"
                        : "text-gray-700 hover:bg-teal-50"
                    }`}
                  >
                    <m.icon className="w-5 h-5" />
                    {m.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 📦 Konten Utama */}
      <main className="pt-20 px-6 pb-10 max-w-7xl mx-auto">
        {activeMenu === "dashboard" && (
          <Dashboard
            templates={templates}
            activeMenu={activeMenu}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedTemplate={setSelectedTemplate}
          />
        )}
        {activeMenu === "preview" && (
          <Preview activeMenu={activeMenu} user={user} />
        )}
        {activeMenu === "share" && (
          <Share activeMenu={activeMenu} purchases={purchases} />
        )}
        {activeMenu === "pembayaran" && (
          <Pembayaran purchases={purchases} activeMenu={activeMenu} />
        )}

        {/* 🛍️ Pesanan Saya */}
        {activeMenu === "pesanan_saya" && (
          <PesananSaya purchases={purchases} templates={[allTemplates]} />
        )}
      </main>
    </div>
  );
};

export default DashboardUser;
