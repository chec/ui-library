const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const assets = require('postcss-assets');

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
    assets,
  ],
};
