/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FA7818',
        secondary: '#678289',
        accent: '#B4B4B6',
        dark: '#26282C',
        light: '#f4f1ec',
      },
    },
  },
  plugins: [],
};
