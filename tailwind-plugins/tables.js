const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addBase, config }) => addBase({
  table: {
    boxShadow: config('theme.boxShadow.sm'),
    borderRadius: config('theme.borderRadius.md'),
    overflow: 'hidden',
    textAlign: 'left',
    backgroundColor: config('theme.colors.white'),
    color: config('theme.colors.gray-500'),
  },
  'thead th': {
    backgroundColor: config('theme.colors.gray-200'),
    textTransform: 'uppercase',
    fontSize: config('theme.fontSize.xxs'),
    padding: '0.75rem 1rem',
    fontWeight: 'bold',
    letterSpacing: config('theme.letterSpacing.widest'),
  },
  'tbody td': {
    fontSize: config('theme.fontSize.sm'),
  },
  'tbody tr': {
    '&:hover': {
      backgroundColor: config('theme.colors.gray-100'),
    },
    '&:not(:last-child)': {
      borderBottom: `${config('theme.borderWidth.default')} solid ${config('theme.colors.gray-200')}`,
    },
  },
  'td, th': {
    padding: config('theme.spacing.4'),
    backgroundColor: config('theme.color.white'),
  },
}));
