import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const qrDataUrl = await QRCode.toDataURL(url);

    return NextResponse.json({ qrDataUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
