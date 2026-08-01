/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: '#FBEFEF',       // Lightest soft off-white blush
          secondary: '#FFE2E2',// Soft pink section background
          card: '#FFFFFF',     // Clean card background
          accent: '#F5CBCB',   // Soft rose border / container
          lavender: '#C5B3D3', // Primary lavender accent
          textMain: '#2D1E2F', // Deep plum text for ultra crisp contrast
          textMuted: '#7A5C77',// Muted plum-slate text
          churn: '#E65B7B',    // Rose pink-red for churn/danger
          retention: '#3BB28B',// Soft emerald for retention/positive
          amber: '#E69537',    // Warm amber warning
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
