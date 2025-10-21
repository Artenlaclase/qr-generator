declare module "*.css" {
  const content: unknown;
  export default content;
}

// Allow side-effect CSS imports (e.g., import "./globals.css")
declare module "*.css";
