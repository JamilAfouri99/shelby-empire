import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const quote = searchParams.get("quote") ?? "By Order of the Peaky Blinders";
  const character = searchParams.get("character") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
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
            }}
          >
            BY ORDER
          </div>
          <div
            style={{
              fontSize: "36px",
              color: "#f5f5f5",
              textAlign: "center",
              lineHeight: "1.4",
              fontStyle: "italic",
            }}
          >
            &ldquo;{quote.length > 120 ? quote.slice(0, 120) + "..." : quote}&rdquo;
          </div>
          {character && (
            <div
              style={{
                fontSize: "20px",
                color: "#c9a84c",
                marginTop: "20px",
              }}
            >
              — {character}
            </div>
          )}
          <div
            style={{
              fontSize: "16px",
              color: "#888888",
              marginTop: "40px",
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
    }
  );
}
