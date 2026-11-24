import { ImageResponse } from "next/og";

export const alt = "Гульназ Мусина — AI Product Manager / Product Owner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const METRICS = [
  { value: "2", label: "AI-сервиса" },
  { value: "100%", label: "QA звонков" },
  { value: "0,27", label: "руб. за разбор" },
  { value: "20+", label: "лет опыта" },
] as const;

export default function AboutOpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070B14",
          padding: "68px 72px",
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
            background: "rgba(13,148,136,0.3)",
            filter: "blur(120px)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #4f46e5, #2dd4bf)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "19px",
              fontWeight: 700,
            }}
          >
            ГМ
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              letterSpacing: "4px",
              fontWeight: 700,
            }}
          >
            Aillix.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "24px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#5eead4",
              fontWeight: 700,
            }}
          >
            AI Product Manager / Product Owner
          </div>
          <div
            style={{
              marginTop: "18px",
              fontSize: "68px",
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-2px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Гульназ Мусина</span>
            <span style={{ color: "#a5b4fc" }}>AI-продукты до запуска</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "26px",
          }}
        >
          <div style={{ display: "flex", gap: "34px" }}>
            {METRICS.map((metric) => (
              <div
                key={metric.label}
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span
                  style={{
                    fontSize: "30px",
                    fontWeight: 700,
                    color: "#5eead4",
                  }}
                >
                  {metric.value}
                </span>
                <span style={{ fontSize: "17px", color: "#94a3b8" }}>
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
          <span style={{ fontSize: "20px", color: "#64748b" }}>
            aillix.ru/about
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
