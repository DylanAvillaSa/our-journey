"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/libs/config";
import { doc, getDoc } from "firebase/firestore";
import { templatesMap } from "@/app/template/[templateId]/page";

export default function PembeliPage() {
  const { id } = useParams(); // dapet id pembelian
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const ref = doc(db, "pembelian", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          router.push("/404");
          return;
        }

        const orderData = snap.data();
        setData(orderData.dataMempelai);

        // Mapping template
        const templatePath = orderData.link_template.replace("/template/", "");
        const Component = templatesMap[templatePath];

        if (!Component) {
          router.push("/404");
          return;
        }

        setData({ ...orderData, Component });
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!data) return null;

  const TemplateComponent = data.Component;

  return <TemplateComponent data={data?.dataMempelai} previewMode={true} />;
}
