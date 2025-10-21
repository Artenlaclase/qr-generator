import { QRGenerator } from "@/components/qr-generator";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Generador de Códigos QR
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Crea códigos QR personalizados de forma rápida y sencilla. Ideal para enlaces, textos, contactos y más.
            </p>
          </div>

          <QRGenerator />
        </div>
      </div>
    </main>
  );
}
