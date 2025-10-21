"use client";

import { useState } from "react";

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
      </form>

      {qr && (
        <div className="mt-8 text-center">
          <img
            src={qr}
            alt="Código QR"
            className="mx-auto border rounded-lg shadow-lg"
          />
          <a
            href={qr}
            download="codigo-qr.png"
            className="block mt-4 text-blue-600 underline"
          >
            Descargar QR
          </a>
        </div>
      )}
    </main>
  );
}
