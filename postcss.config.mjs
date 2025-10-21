// Next.js expects PostCSS plugins to be provided as an object mapping of
// plugin name -> options. Avoid passing plugin functions directly.
// Tailwind CSS v4 uses the official @tailwindcss/postcss plugin.
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
