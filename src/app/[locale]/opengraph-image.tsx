import { ImageResponse } from "next/og";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "edge";
export const alt = "Mikael Sundh — Portfolio";
export const size = { width: 1200, height: 630 };

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const base = getSiteUrl();
  const origin = base.origin;
  const host = base.host;

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
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.35), transparent 55%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.35), transparent 55%), radial-gradient(circle at 50% 80%, rgba(251,191,36,0.30), transparent 55%), linear-gradient(135deg, #05060a, #0b0b0b)",
          color: "white",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#10b981",
              boxShadow: "0 0 30px rgba(16,185,129,0.7)",
            }}
          />
          <div style={{ fontSize: 28, opacity: 0.9 }}>{origin}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 78, fontWeight: 800, letterSpacing: -1 }}>
            Mikael Sundh
          </div>
          <div style={{ fontSize: 34, opacity: 0.9 }}>{subtitle}</div>
          <div style={{ fontSize: 26, opacity: 0.75 }}>
            {locale === "sv" ? "Se projekt och erfarenhet" : "Projects • Experience • Skills"}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.8 }}>
          <div style={{ fontSize: 24 }}>
            {locale === "sv" ? "Språk: Svenska" : "Language: English"}
          </div>
          <div style={{ fontSize: 24 }}>{host}</div>
        </div>
      </div>
    ),
    size
  );
}


