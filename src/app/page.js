"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import HeroSection from "@/components/ui/section/HeroSection";
import FiturSection from "@/components/ui/section/FiturSection";
import GaleriTemplateSection from "@/components/ui/section/GaleriSection";
import MemilihKamiSection from "@/components/ui/section/MemilihKamiSection";

export default function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const handleSendToWhatsApp = () => {
    const phoneNumber = "6285351873440";
    const message = `Halo, saya ingin memesan template ${selectedTemplate.name}. Apakah masih tersedia?`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full min-h-screen font-sans">
      <HeroSection />
      <FiturSection />
      <GaleriTemplateSection
        setSelectedTemplate={setSelectedTemplate}
        setOpenModal={setOpenModal}
      />
      <MemilihKamiSection />

      {/* Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl max-w-3xl w-full shadow-lg overflow-hidden">
            {selectedTemplate && (
              <div>
                <Image
                  src={selectedTemplate.src}
                  alt={selectedTemplate.name}
                  width={100}
                  height={100}
                  className="w-[200px] h-auto mx-auto"
                />
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-semibold mb-4">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Klik tombol di bawah ini untuk mengirim pesan ke WhatsApp
                    kami.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleSendToWhatsApp}
                      className="bg-green-600 text-white text-xs px-6 py-3 rounded-lg hover:bg-green-700 transition"
                    >
                      Kirim via WhatsApp
                    </button>
                    <button
                      onClick={() => setOpenModal(false)}
                      className="bg-gray-300 text-gray-800 px-6 text-xs py-3 rounded-lg hover:bg-gray-400 transition"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
