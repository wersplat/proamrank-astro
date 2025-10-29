/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 
          gold: "#D4AF37", 
          black: "#0a0a0a", 
          blue: "#1E3A8A", // Deep blue (replacing bright blue)
          red: "#DC2626", // Vibrant red
          white: "#FFFFFF",
          navy: "#0F172A", // Very dark blue for backgrounds
          xbox: "#9BF00B" 
        },
        gold: "#D4AF37",
        // Custom red, white, blue palette
        patriot: {
          red: {
            50: "#FEF2F2",
            100: "#FEE2E2",
            200: "#FECACA",
            300: "#FCA5A5",
            400: "#F87171",
            500: "#EF4444",
            600: "#DC2626", // Primary red
            700: "#B91C1C",
            800: "#991B1B",
            900: "#7F1D1D",
          },
          blue: {
            50: "#1E293B",
            100: "#1E3A5F",
            200: "#1E3A7A",
            300: "#1E4785", // Darker blue for text
            400: "#3B5B8A", // Muted blue for links/text
            500: "#2C4A6B",
            600: "#1E3A5F",
            700: "#1A3250",
            800: "#132842", // Darker navy blue
            900: "#0F1B2E", // Very dark navy for backgrounds
          },
        }
      }
    }
  },
  plugins: []
};
