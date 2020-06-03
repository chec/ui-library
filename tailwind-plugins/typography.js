const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addUtilities, config }) => {
  const caps = {
    letterSpacing: config('theme.letterSpacing.widest'),
    textTransform: 'uppercase',
    fontWeight: config('theme.fontWeight.bold'),
  };

  addUtilities({
    '.small-caps': {
      fontSize: config('theme.fontSize.xs'),
      ...caps,
    },
    '.tiny-caps': {
      fontSize: config('theme.fontSize.xxs'),
      ...caps,
    },
  });
});
