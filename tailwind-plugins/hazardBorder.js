const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addUtilities, config }) => {
  const colours = config('theme.colors');

  const options = [
    ['gray', 'gray-600', 'gray-300'],
  ];

  addUtilities(options.reduce((acc, [name, colourA, colourB]) => ({
    ...acc,
    [`.border-hazard-${name}`]: {
      borderImage: `repeating-linear-gradient(
        -15deg,
        ${colours[colourA]},
        ${colours[colourA]} 5px,
        ${colours[colourB]} 5px,
        ${colours[colourB]} 10px
      ) 10;`,
    },
  }), {}));
});
