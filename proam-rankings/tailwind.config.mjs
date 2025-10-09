/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { gold: "#D4AF37", black: "#0a0a0a", blue: "#0051FF", xbox: "#9BF00B" },
        gold: "#D4AF37"
      }
    }
  },
  plugins: []
};
