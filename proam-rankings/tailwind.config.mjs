/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
            // Light mode variants
            light: {
              50: "#EFF6FF", // Very light blue
              100: "#DBEAFE", // Light blue
              200: "#BFDBFE", // Lighter blue
              300: "#93C5FD", // Medium light blue
              400: "#60A5FA", // Medium blue
              500: "#3B82F6", // Standard blue
              600: "#2563EB", // Medium dark blue
              700: "#1D4ED8", // Dark blue
              800: "#1E40AF", // Darker blue
              900: "#1E3A8A", // Very dark blue
            }
          },
        }
      }
    }
  },
  plugins: []
};
