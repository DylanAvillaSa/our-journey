"use client";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (
    pathname.startsWith("/template/") ||
    pathname.startsWith("/form-pemesanan/") ||
    pathname.startsWith("/template-pembeli") ||
    pathname === "/dashboard-admin" ||
    pathname === "/dashboard-user" ||
    pathname.startsWith("/preview-edit-template") ||
    pathname === "/share-to" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/preview-undangan") ||
    pathname.startsWith("/pembayaran")
  ) {
    return null;
  }
  return (
    <footer className="bg-gray-800 text-white py-6 text-center">
      © {new Date().getFullYear()} Our Journey — All Rights Reserved
    </footer>
  );
};

export default Footer;
