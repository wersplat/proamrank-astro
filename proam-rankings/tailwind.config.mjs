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
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            300: "#93C5FD",
            400: "#60A5FA",
            500: "#3B82F6",
            600: "#2563EB",
            700: "#1D4ED8",
            800: "#1E3A8A", // Primary blue
            900: "#1E40AF",
          },
        }
      }
    }
  },
  plugins: []
};
