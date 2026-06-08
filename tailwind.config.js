/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        gold: {
          50: "#FFF9E6",
          100: "#FFF0BF",
          200: "#FFE080",
          300: "#FFD040",
          400: "#D4AF37",
          500: "#B8941E",
          600: "#9A7B10",
          700: "#7C6200",
          800: "#5E4A00",
          900: "#403200",
        },
        neon: {
          pink: "#FF2D78",
          blue: "#00D4FF",
          purple: "#B388FF",
        },
        dark: {
          900: "#0A0A0F",
          800: "#12121A",
          700: "#1A1A2E",
          600: "#22223A",
          500: "#2A2A45",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      animation: {
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "glow": "glow 1.5s ease-in-out infinite alternate",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
      keyframes: {
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.6)" },
        },
        "glow": {
          "0%": { opacity: "0.8" },
          "100%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)",
        "dark-gradient": "linear-gradient(180deg, #0A0A0F 0%, #12121A 100%)",
        "neon-gradient": "linear-gradient(135deg, #FF2D78 0%, #B388FF 100%)",
        "cyber-gradient": "linear-gradient(135deg, #00D4FF 0%, #B388FF 50%, #FF2D78 100%)",
      },
    },
  },
  plugins: [],
};
