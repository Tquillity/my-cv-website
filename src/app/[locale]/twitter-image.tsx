import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mikael Sundh — Portfolio";
export const size = { width: 1200, height: 630 };

export default async function TwitterImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const subtitle =
    locale === "sv"
      ? "Fullstackutvecklare • Next.js • React • 3D • AI"
      : "Fullstack Engineer • Next.js • React • 3D • AI";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.22), rgba(59,130,246,0.22)), linear-gradient(135deg, #05060a, #0b0b0b)",
          color: "white",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ fontSize: 78, fontWeight: 800, letterSpacing: -1 }}>
          Mikael Sundh
        </div>
        <div style={{ fontSize: 34, marginTop: 16, opacity: 0.9 }}>{subtitle}</div>
        <div style={{ fontSize: 24, marginTop: 28, opacity: 0.75 }}>
          {locale === "sv" ? "/portfolio • /about" : "/portfolio • /about"}
        </div>
      </div>
    ),
    size
  );
}


