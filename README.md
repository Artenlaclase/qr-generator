## Generador de Códigos QR

Aplicación web para crear códigos QR de forma rápida y simple. Permite ingresar una URL, elegir tamaño (chico/mediano/grande), personalizar colores (oscuro y claro) y descargar el resultado en PNG, JPG o PDF.

### Características
- Generación de QR desde una URL (con normalización automática del protocolo https cuando falta).
- Tres tamaños predefinidos: Chico (256px), Mediano (512px), Grande (1024px).
- Personalización de colores (color oscuro y color claro en formato HEX).
- Vista previa inmediata del QR generado.
- Descarga en múltiples formatos: PNG, JPG y PDF.
- Botón para limpiar el formulario y empezar nuevamente.

### Tecnologías utilizadas
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS v4 con PostCSS y Autoprefixer
- API Route con la librería `qrcode` para generar el QR en el servidor
- `jsPDF` para exportar a PDF
- `next/image` y `next/font` (Geist)
- (Opcional) `@vercel/analytics`

## Cómo ejecutar el proyecto

Requisitos: Node.js LTS (18+ recomendado) y un gestor de paquetes (npm, yarn, pnpm o bun).

1. Instala dependencias:

```powershell
npm install
```

2. Inicia el servidor de desarrollo:

```powershell
npm run dev
```

3. Abre http://localhost:3000 en tu navegador.

## Demo en producción
- URL: https://creaqr.vercel.app/

## Favicon
- Favicon activo: `public/favicon.svg` (se configura vía `metadata.icons` en `src/app/layout.tsx`).
- Se eliminó el uso de `app/icon.svg` y se recomienda borrar `src/app/favicon.ico` para evitar conflictos.

## Uso básico
1. Ingresa una URL en el campo de texto.
2. Selecciona un tamaño (Chico/Mediano/Grande).
3. (Opcional) Ajusta los colores del QR.
4. Haz clic en “Generar QR”.
5. Descarga el QR en el formato que necesites (PNG/JPG/PDF) o usa “Limpiar” para reiniciar.

## API interna
La aplicación expone una ruta interna en `POST /api/generate-qr` que recibe JSON con:

```json
{
	"url": "https://ejemplo.com",
	"size": "chico" | "mediano" | "grande",
	"darkColor": "#000000",
	"lightColor": "#ffffff"
}
```

Devuelve un Data URL (base64) de la imagen del QR.

## Licencia
Proyecto con fines educativos y demostrativos. Derechos reservados por sus autores.
