const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addUtilities, config }) => {
  const caps = {
    letterSpacing: config('theme.letterSpacing.widest'),
    textTransform: 'uppercase',
    fontWeight: config('theme.fontWeight.bold'),
  };

  addUtilities({
    '.caps-xs': {
      fontSize: config('theme.fontSize.xs'),
      ...caps,
    },
    '.caps-xxs': {
      fontSize: config('theme.fontSize.xxs'),
      ...caps,
    },
  });
});
