"use client";

import { useState } from "react";
import NextImage from "next/image";
import { jsPDF } from "jspdf";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SizeKey = "pequeño" | "mediano" | "grande";


export function QRGenerator() {
  const [url, setUrl] = useState<string>("");
  const [qr, setQr] = useState<string>("");
  const [size, setSize] = useState<SizeKey>("mediano");
  const [darkColor, setDarkColor] = useState<string>("#000000");
  const [lightColor, setLightColor] = useState<string>("#FFFFFF");

  const normalizeUrl = (value: string) => {
    const v = value.trim();
    if (!v) return v;
    if (/^https?:\/\//i.test(v)) return v;
    // Si no tiene protocolo, asumimos https
    return `https://${v}`;
  };

  const generarQR = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    const res = await fetch("/api/generate-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: normalized, size, darkColor, lightColor }),
    });
    const data = await res.json();
    setQr(data.qrDataUrl);
    // Opcional: reflejar la normalización en el input
    setUrl(normalized);
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
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pxToMm = (px: number) => (px * 25.4) / 96;
    let imgWmm = pxToMm(canvas.width);
    let imgHmm = pxToMm(canvas.height);
    const maxW = 180;
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

  const sizeLabels: Record<SizeKey, string> = {
    pequeño: "Pequeño (256px)",
    mediano: "Mediano (512px)",
    grande: "Grande (1024px)",
  };

  const previewSize = size === "pequeño" ? 256 : size === "mediano" ? 384 : 512;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Configuración</CardTitle>
          <CardDescription>Personaliza tu código QR y genera la imagen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={generarQR} className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="text"
                inputMode="url"
                autoComplete="url"
                placeholder="https://ejemplo.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="mb-1 block">Tamaño</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["pequeño", "mediano", "grande"] as const).map((t) => (
                  <Button
                    key={t}
                    type="button"
                    onClick={() => setSize(t)}
                    className={`${
                      size === t
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {sizeLabels[t]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Color oscuro</Label>
                <div className="flex items-center gap-2">
                  <Input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)} className="h-10 w-12 p-0" />
                  <Input type="text" value={darkColor} onChange={(e) => setDarkColor(e.target.value)} />
                </div>
              </div>
              <div>
                <Label className="mb-1 block">Color claro</Label>
                <div className="flex items-center gap-2">
                  <Input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} className="h-10 w-12 p-0" />
                  <Input type="text" value={lightColor} onChange={(e) => setLightColor(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="submit">Generar QR</Button>
              <Button type="button" onClick={limpiar} className="bg-gray-100 text-gray-800 hover:bg-gray-200">Limpiar</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle>Vista previa</CardTitle>
          <CardDescription>Descarga tu QR como PNG, JPG o PDF</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {qr ? (
            <NextImage
              src={qr}
              alt="Código QR"
              width={previewSize}
              height={previewSize}
              className="mx-auto border rounded-lg shadow"
            />
          ) : (
            <div className="text-sm text-muted-foreground">Genera un QR para verlo aquí</div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3 justify-center">
          <Button type="button" onClick={descargarPNG} disabled={!qr}>
            Descargar PNG
          </Button>
          <Button type="button" onClick={descargarJPG} disabled={!qr}>
            Descargar JPG
          </Button>
          <Button type="button" onClick={descargarPDF} disabled={!qr}>
            Descargar PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
