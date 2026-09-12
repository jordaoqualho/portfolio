import { ImageResponse } from "next/og";
export const alt =
  "Jordão Qualho, Senior Software Engineer. Full Stack with backend depth. Brazil, open to remote.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";
export default function Image() {
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
        <span>ENGINEERING PROFILE</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          letterSpacing: "-4px",
          lineHeight: 1.05,
          marginTop: 65,
        }}
      >
        Senior Software Engineer<span style={{ color: "#375eaa" }}>.</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 25,
          color: "#656b73",
          marginTop: 30,
        }}
      >
        Node.js · TypeScript · React · AWS · GCP
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
        <span>Full Stack · Backend depth</span>
        <span>Brazil · Open to remote</span>
      </div>
    </div>,
    size,
  );
}
