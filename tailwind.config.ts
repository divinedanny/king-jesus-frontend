import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdfbf0',
          100: '#f9f3c2',
          200: '#f3e685',
          300: '#edd847',
          400: '#e7cb1a',
          500: '#d4af37', // Gold
          600: '#aa9a2c',
          700: '#807a21',
          800: '#555a16',
          900: '#2b3a0b',
        },
        secondary: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
        },
        gold: {
          50: '#fdfbf0',
          100: '#f9f3c2',
          200: '#f3e685',
          300: '#edd847',
          400: '#e7cb1a',
          500: '#d4af37',
          600: '#aa9a2c',
          700: '#807a21',
          800: '#555a16',
          900: '#2b3a0b',
        },
        black: '#000000',
        white: '#ffffff',
      },
    },
  },
  plugins: [],
};
export default config;
