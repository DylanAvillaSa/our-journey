"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/libs/config";
import { doc, setDoc } from "firebase/firestore";

const RegisterPage = () => {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Simpan data user di Firestore
      await setDoc(doc(db, "users", user.uid), {
        nama,
        email,
        createdAt: new Date(),
      });

      setSuccess("Berhasil mendaftar");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email sudah terdaftar. Gunakan email lain.");
      } else if (err.code === "auth/weak-password") {
        setError("Password harus memiliki minimal 6 karakter.");
      } else {
        setError("Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-6 py-12">
      {/* Kanan - Form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo/logo-our-journey.png"
            alt="Logo"
            width={60}
            height={60}
            priority
          />
          <h1 className="text-2xl font-bold mt-3 text-gray-800">
            Daftar Akun Baru 💍
          </h1>
          <p className="text-gray-500 text-sm text-center mt-1">
            Buat akunmu dan mulai perjalanan indah bersama kami.
          </p>
        </div>

        {/* Form Register */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-green-400 rounded-lg px-4 py-2 outline-none transition"
              placeholder="Contoh: John doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-green-400 rounded-lg px-4 py-2 outline-none transition"
              placeholder="contoh@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-green-400 rounded-lg px-4 py-2 outline-none transition"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          {success && (
            <p className="text-teal-500 text-sm text-center mt-2">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 rounded-lg font-semibold transition-all ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Sudah punya akun?{" "}
          <span
            onClick={() => router.push("/login-user")}
            className="text-green-600 font-semibold cursor-pointer hover:underline"
          >
            Masuk sekarang
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
