"use client";

import { useState } from "react";
import NextImage from "next/image";
import { jsPDF } from "jspdf";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [qr, setQr] = useState<string>("");

  const generarQR = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/generate-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
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
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Generador de Códigos QR
      </h1>

      <form onSubmit={generarQR} className="flex flex-col items-center gap-4">
        <input
          type="url"
          placeholder="Escribe o pega tu enlace"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-gray-400 rounded-lg px-4 py-2 w-80"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Generar QR
        </button>
        <button
          type="button"
          onClick={limpiar}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Limpiar
        </button>
      </form>

      {qr && (
        <div className="mt-8 text-center">
          <NextImage
            src={qr}
            alt="Código QR"
            width={256}
            height={256}
            className="mx-auto border rounded-lg shadow-lg"
          />
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={descargarPNG}
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
            >
              Descargar PNG
            </button>
            <button
              type="button"
              onClick={descargarJPG}
              className="bg-amber-600 text-white px-3 py-2 rounded hover:bg-amber-700 transition"
            >
              Descargar JPG
            </button>
            <button
              type="button"
              onClick={descargarPDF}
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
            >
              Descargar PDF
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
