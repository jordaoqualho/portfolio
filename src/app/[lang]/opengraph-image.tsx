import { locales } from "@/i18n/config";
import { ImageResponse } from "next/og";
export const alt =
  "Jordão Qualho, Senior Software Engineer. Full Stack with backend depth. Brazil, open to remote.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
const copy = {
  en: {
    eyebrow: "ENGINEERING PROFILE",
    role: "Senior Software Engineer",
    focus: "Full Stack · Backend depth",
    location: "Brazil · Open to remote",
  },
  pt: {
    eyebrow: "PERFIL DE ENGENHARIA",
    role: "Engenheiro de Software Sênior",
    focus: "Full Stack · Profundidade em backend",
    location: "Brasil · Aberto a vagas remotas",
  },
} as const;
export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = lang === "pt" ? copy.pt : copy.en;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fcfcfb",
        color: "#20252b",
        padding: "64px 76px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          color: "#656b73",
        }}
      >
        <span>JORDÃO QUALHO</span>
        <span>{t.eyebrow}</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: lang === "pt" ? 68 : 76,
          letterSpacing: "-4px",
          lineHeight: 1.05,
          marginTop: 65,
        }}
      >
        {t.role}
        <span style={{ color: "#375eaa" }}>.</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 25,
          color: "#656b73",
          marginTop: 30,
        }}
      >
        Node.js · TypeScript · React · AWS · Google Cloud Platform
      </div>
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #dfe2e5",
          marginTop: "auto",
          paddingTop: 25,
          justifyContent: "space-between",
          fontSize: 25,
        }}
      >
        <span>{t.focus}</span>
        <span>{t.location}</span>
      </div>
    </div>,
    size,
  );
}
