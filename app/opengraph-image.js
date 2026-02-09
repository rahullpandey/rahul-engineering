import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f7f3ed 0%, #efe4d8 50%, #f7f3ed 100%)",
          fontFamily: "Times New Roman"
        }}
      >
        <div
          style={{
            width: "92%",
            height: "82%",
            borderRadius: "32px",
            border: "1px solid rgba(200, 160, 110, 0.45)",
            background: "rgba(255,255,255,0.72)",
            boxShadow: "0 30px 60px rgba(27, 42, 65, 0.18)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "16px",
                border: "2px solid rgba(43, 43, 43, 0.25)",
                background: "#f7f3ed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "64px",
                fontWeight: 700,
                color: "#2b2b2b",
                position: "relative"
              }}
            >
              <span style={{ position: "absolute", left: "26px", top: "18px" }}>R</span>
              <span style={{ position: "absolute", right: "22px", bottom: "18px", color: "#a8793e" }}>E</span>
            </div>
            <div>
              <div style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "0.04em" }}>
                Rahul Engineering
              </div>
              <div style={{ marginTop: "12px", fontSize: "28px", color: "#6c6a66", letterSpacing: "0.1em" }}>
                Hospitality Workforce & Project Management
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "36px",
              fontSize: "28px",
              color: "#3b2f24",
              maxWidth: "90%"
            }}
          >
            Trusted manpower partner for premium hotels. 24/7 coverage, verified teams, and on-time staffing.
          </div>
        </div>
      </div>
    ),
    size
  );
}
