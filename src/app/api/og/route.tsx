import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawQuote = searchParams.get("quote") ?? "By Order of the Peaky Blinders";
  const rawCharacter = searchParams.get("character") ?? "";
  const quote = rawQuote.length > 200 ? rawQuote.slice(0, 200) + "..." : rawQuote;
  const character = rawCharacter.length > 60 ? rawCharacter.slice(0, 60) + "..." : rawCharacter;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0c0d0e 0%, #161412 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              color: "#c9a84c",
              fontWeight: "bold",
              marginBottom: "30px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            BY ORDER
          </div>
          <div
            style={{
              fontSize: "36px",
              color: "#e8e2d4",
              textAlign: "center",
              lineHeight: "1.4",
              fontStyle: "italic",
              display: "flex",
            }}
          >
            {`\u201C${quote.length > 120 ? quote.slice(0, 120) + "..." : quote}\u201D`}
          </div>
          {character && (
            <div
              style={{
                fontSize: "20px",
                color: "#c9a84c",
                marginTop: "20px",
                display: "flex",
              }}
            >
              {`— ${character}`}
            </div>
          )}
          <div
            style={{
              fontSize: "16px",
              color: "#6b6460",
              marginTop: "40px",
              display: "flex",
            }}
          >
            byorder.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
