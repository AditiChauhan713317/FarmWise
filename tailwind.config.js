/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
   content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
   // cause the tawilwindcss needs to work on files in both app and components folder
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["SpaceMono", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: {
          DEFAULT: "#2E7D32",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#4CAF50",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
        background: "#FFFFFF",
        foreground: "#0F172A",
      },
      borderRadius: {
        xl: "16px",
      },
    },
  },
  plugins: [],
}