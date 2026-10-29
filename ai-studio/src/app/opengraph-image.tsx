import { ImageResponse } from "next/og";

export const alt = "AI.STUDIO — Generative AI for real business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#030712",
          padding: "72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-180px",
            right: "-120px",
            width: "560px",
            height: "560px",
            borderRadius: "9999px",
            background: "rgba(79,70,229,0.35)",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-220px",
            left: "-140px",
            width: "520px",
            height: "520px",
            borderRadius: "9999px",
            background: "rgba(168,85,247,0.28)",
            filter: "blur(120px)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #4f46e5, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            AI
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              letterSpacing: "4px",
              fontWeight: 700,
            }}
          >
            <span>AI</span>
            <span style={{ color: "#6b7280" }}>.</span>
            <span>STUDIO</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "66px",
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: "-2px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Generative AI</span>
            <span style={{ color: "#a5b4fc" }}>for real business</span>
          </div>
          <div
            style={{
              marginTop: "24px",
              fontSize: "26px",
              color: "#94a3b8",
              display: "flex",
              gap: "24px",
            }}
          >
            <span>Agents</span>
            <span style={{ color: "#4f46e5" }}>•</span>
            <span>RAG systems</span>
            <span style={{ color: "#4f46e5" }}>•</span>
            <span>Live MVP</span>
            <span style={{ color: "#4f46e5" }}>•</span>
            <span>Compliance</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#64748b",
          }}
        >
          <span>ai-studio</span>
          <span>Python · FastAPI · Java 17 · Docker · Yandex Cloud</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
