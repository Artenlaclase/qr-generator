import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    const { url, size } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    // Mapear tamaño a resolución (px)
    const widthMap: Record<string, number> = {
      chico: 256,
      mediano: 512,
      grande: 1024,
    };
    const width = widthMap[(size as string) ?? "mediano"] ?? widthMap["mediano"];

    const qrDataUrl = await QRCode.toDataURL(url, {
      width,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return NextResponse.json({ qrDataUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
