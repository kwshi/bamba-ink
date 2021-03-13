const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", ...defaultTheme.fontFamily.sans],
        mono: ["Inconsolata", ...defaultTheme.fontFamily.mono],
      },
      colors: Object.fromEntries(
        Object.entries(colors).map(([k, v]) => [k.toLowerCase(), v])
      ),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
