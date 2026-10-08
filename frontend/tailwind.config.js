/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#1A56DB',
          hover: '#1E429F',
        },
        accent: {
          DEFAULT: '#0E9F6E',
          hover: '#057A55',
        },
        danger: {
          DEFAULT: '#E02424',
          hover: '#C81E1E',
        },
        light: '#F9FAFB',
        dark: '#111827',
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        chip: '24px',
      },
      boxShadow: {
        subtle: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
