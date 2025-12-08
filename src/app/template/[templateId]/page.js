"use client";

import { useParams } from "next/navigation";
import Template1Silver from "@/app/template/template-1-silver";
import Template2Silver from "@/app/template/template-2-silver";
import Template3Silver from "@/app/template/template-3-silver";
import Template4Gold from "@/app/template/template-1-gold";
import Template5Gold from "@/app/template/template-2-gold";
import Template6Gold from "@/app/template/template-3-gold";
import Template7Gold from "@/app/template/template-4-gold";
import Template8Gold from "@/app/template/template-5-gold";
import Template9Gold from "@/app/template/template-6-gold";
import Template10Gold from "@/app/template/template-7-gold";
import Template12Gold from "@/app/template/template-1-platinum";
import Template13Gold from "@/app/template/template-2-platinum";
import Template14Gold from "@/app/template/template-3-platinum";
import Template15Gold from "@/app/template/template-4-platinum";
import Template16Gold from "@/app/template/template-8-gold";

export const templatesMap = {
  "template-1-silver": Template1Silver,
  "template-2-silver": Template2Silver,
  "template-3-silver": Template3Silver,
  "template-4-gold": Template4Gold,
  "template-5-gold": Template5Gold,
  "template-6-gold": Template6Gold,
  "template-8-gold": Template7Gold,
  "template-9-gold": Template8Gold,
  "template-10-gold": Template9Gold,
  "template-11-gold": Template10Gold,
  "template-13-platinum": Template12Gold,
  "template-14-platinum": Template13Gold,
  "template-15-platinum": Template14Gold,
  "template-16-platinum": Template15Gold,
  "template-12-gold": Template16Gold,
};

export default function TemplatePage() {
  const { templateId } = useParams();
  const TemplateComponent = templatesMap[templateId];

  if (!TemplateComponent)
    return <div className="text-center py-20">Template tidak ditemukan</div>;

  return <TemplateComponent />;
}
