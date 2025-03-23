/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        "md-blur": "0px 0px 8px 0px rgba(0, 0, 0, 0.12)",
      }
    },
  },
  plugins: [],
};
