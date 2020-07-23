const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addUtilities, config }) => {
  const fontSizes = config('theme.fontSize');

  // Reduce the existing font sizes and make a height/width definition for each one
  addUtilities(Object.entries(fontSizes).reduce((acc, [label, size]) => ({
    ...acc,
    [`.icon-${label}`]: {
      width: size,
      height: size,
    },
  }), {}));
});
