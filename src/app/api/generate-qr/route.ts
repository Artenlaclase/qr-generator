import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    const { url, size, darkColor, lightColor } = await req.json();

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

    // Validar colores HEX (#RGB o #RRGGBB) con fallback
    const isHex = (v: unknown) =>
      typeof v === "string" && /^#([\da-fA-F]{3}|[\da-fA-F]{6})$/.test(v);
    const dark = isHex(darkColor) ? (darkColor as string) : "#000000";
    const light = isHex(lightColor) ? (lightColor as string) : "#FFFFFF";

    const qrDataUrl = await QRCode.toDataURL(url, {
      width,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark,
        light,
      },
    });

    return NextResponse.json({ qrDataUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
