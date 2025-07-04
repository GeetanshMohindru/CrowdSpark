/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Midnight Blue
        },
        accent: {
          DEFAULT: '#FBBF24', // Sun Gold
        },
        background: {
          DEFAULT: '#F9FAFB', // Off White
        },
        dark: {
          DEFAULT: '#1F2937', // Charcoal Gray
        },
        muted: {
          DEFAULT: '#6B7280', // Slate Gray
        },
        success: {
          DEFAULT: '#10B981', // Emerald
        },
        error: {
          DEFAULT: '#EF4444', // Rose Red
        },
      },
    },
  },
  plugins: [],
}

