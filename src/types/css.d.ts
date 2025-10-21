declare module "*.css" {
  const content: unknown;
  export default content;
}

// Allow side-effect CSS imports (e.g., import "./globals.css")
declare module "*.css";

// Ambient declarations for archived-only modules to silence editor errors
declare module "qrcode.react" {
  import * as React from "react";
  export interface QRCodeSVGProps extends React.SVGProps<SVGSVGElement> {
    value: string;
    size?: number;
    level?: "L" | "M" | "Q" | "H";
    bgColor?: string;
    fgColor?: string;
    includeMargin?: boolean;
  }
  export const QRCodeSVG: React.FC<QRCodeSVGProps>;
}

declare module "lucide-react" {
  import * as React from "react";
  export const Download: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Link2: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Type: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Mail: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Phone: React.FC<React.SVGProps<SVGSVGElement>>;
}
