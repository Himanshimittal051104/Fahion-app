/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  productionBrowserSourceMaps: false,
  theme: {
    extend: {
      colors: {
        customPink: '#e0b1cb',
        background: "var(--background)",
        foreground: "var(--foreground)",
        customDarkPurple: '#231942',
      },
    },
  },
  plugins: [],
};
