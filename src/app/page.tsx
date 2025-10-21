"use client";

import { useState } from "react";
import NextImage from "next/image";
import { jsPDF } from "jspdf";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [qr, setQr] = useState<string>("");
  const [size, setSize] = useState<"chico" | "mediano" | "grande">("mediano");

  const generarQR = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/generate-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, size }),
    });

    const data = await res.json();
    setQr(data.qrDataUrl);
  };

  const limpiar = () => {
    setUrl("");
    setQr("");
  };

  const download = (dataUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const dataUrlToCanvas = (dataUrl: string): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("No 2D context"));
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
      img.src = dataUrl;
    });
  };

  const descargarPNG = () => {
    if (!qr) return;
    download(qr, "codigo-qr.png");
  };

  const descargarJPG = async () => {
    if (!qr) return;
    const canvas = await dataUrlToCanvas(qr);
    const jpgDataUrl = canvas.toDataURL("image/jpeg", 0.92);
    download(jpgDataUrl, "codigo-qr.jpg");
  };

  const descargarPDF = async () => {
    if (!qr) return;
    const canvas = await dataUrlToCanvas(qr);
    const imgData = canvas.toDataURL("image/png");
    // Crear PDF en orientación vertical A4 y centrar el QR manteniendo tamaño original hasta 180mm max
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // Convertir px a mm asumiendo 96 DPI: mm = px * 25.4 / 96
    const pxToMm = (px: number) => (px * 25.4) / 96;
    let imgWmm = pxToMm(canvas.width);
    let imgHmm = pxToMm(canvas.height);
    const maxW = 180; // margen
    if (imgWmm > maxW) {
      const ratio = maxW / imgWmm;
      imgWmm = maxW;
      imgHmm = imgHmm * ratio;
    }
    const x = (pageWidth - imgWmm) / 2;
    const y = (pageHeight - imgHmm) / 2;
    pdf.addImage(imgData, "PNG", x, y, imgWmm, imgHmm);
    pdf.save("codigo-qr.pdf");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Generador de Códigos QR
      </h1>

      <form onSubmit={generarQR} className="flex flex-col items-center gap-4 bg-white p-6 rounded-xl shadow-sm w-full max-w-md">
        <input
          type="url"
          placeholder="Escribe o pega tu enlace"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
          <div className="grid grid-cols-3 gap-2">
            {(["chico", "mediano", "grande"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSize(t)}
                className={`px-3 py-2 rounded-lg border text-sm transition ${
                  size === t
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          Generar QR
        </button>
        <button
          type="button"
          onClick={limpiar}
          className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition border"
        >
          Limpiar
        </button>
      </form>

      {qr && (
        <div className="mt-8 text-center">
          <NextImage
            src={qr}
            alt="Código QR"
            width={size === "chico" ? 256 : size === "mediano" ? 512 : 1024}
            height={size === "chico" ? 256 : size === "mediano" ? 512 : 1024}
            className="mx-auto border rounded-lg shadow-lg"
          />
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={descargarPNG}
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition shadow-sm"
            >
              Descargar PNG
            </button>
            <button
              type="button"
              onClick={descargarJPG}
              className="bg-amber-600 text-white px-3 py-2 rounded hover:bg-amber-700 transition shadow-sm"
            >
              Descargar JPG
            </button>
            <button
              type="button"
              onClick={descargarPDF}
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition shadow-sm"
            >
              Descargar PDF
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
