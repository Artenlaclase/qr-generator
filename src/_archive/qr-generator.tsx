"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Card } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Download, Link2, Type, Mail, Phone } from "lucide-react"

export function QRGenerator() {
  const [qrValue, setQrValue] = useState("https://example.com")
  const [qrSize, setQrSize] = useState(256)
  const [qrColor, setQrColor] = useState("#000000")
  const [qrBgColor, setQrBgColor] = useState("#ffffff")
  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    canvas.width = qrSize
    canvas.height = qrSize

    img.onload = () => {
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = "qr-code.png"
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Controls Section */}
      <Card className="p-6">
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              <span className="hidden sm:inline">URL</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">Texto</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Teléfono</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL del sitio web</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://ejemplo.com"
                value={qrValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQrValue(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Texto</Label>
              <Textarea
                id="text"
                placeholder="Escribe tu texto aquí..."
                value={qrValue}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setQrValue(e.target.value)}
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Dirección de email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={qrValue.replace("mailto:", "")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQrValue(`mailto:${e.target.value}`)}
              />
            </div>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Número de teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+34 123 456 789"
                value={qrValue.replace("tel:", "")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQrValue(`tel:${e.target.value}`)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-6 border-t pt-6">
          <h3 className="text-lg font-semibold">Personalización</h3>

          <div className="space-y-2">
            <Label htmlFor="size">Tamaño: {qrSize}px</Label>
            <Input
              id="size"
              type="range"
              min="128"
              max="512"
              step="32"
              value={qrSize}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQrSize(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color del QR</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="color"
                  type="color"
                  value={qrColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setQrColor(e.target.value)}
                  className="h-10 w-full"
                />
                <Input
                  type="text"
                  value={qrColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setQrColor(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bgcolor">Color de fondo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bgcolor"
                  type="color"
                  value={qrBgColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setQrBgColor(e.target.value)}
                  className="h-10 w-full"
                />
                <Input
                  type="text"
                  value={qrBgColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setQrBgColor(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Preview Section */}
      <div className="flex flex-col gap-4">
        <Card className="flex flex-1 items-center justify-center p-8">
          <div ref={qrRef} className="rounded-lg bg-white p-6 shadow-lg" style={{ backgroundColor: qrBgColor }}>
            <QRCodeSVG
              value={qrValue || "https://example.com"}
              size={qrSize}
              fgColor={qrColor}
              bgColor={qrBgColor}
              level="H"
              includeMargin={false}
            />
          </div>
        </Card>

        <Button onClick={handleDownload} className="w-full text-lg py-3">
          <Download className="mr-2 h-5 w-5" />
          Descargar código QR
        </Button>

        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p className="leading-relaxed">
            <strong>Consejo:</strong> Los códigos QR con nivel de corrección alto (H) pueden ser escaneados incluso si
            están parcialmente dañados.
          </p>
        </div>
      </div>
    </div>
  )
}
