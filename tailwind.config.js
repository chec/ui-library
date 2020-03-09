const gradientsPlugin = require('tailwindcss-plugins/gradients');
const plugin = require('tailwindcss/plugin')

const checTablesPlugin = plugin(({addBase, config}) => {
  const tables = {
    table: {
      boxShadow: config('theme.boxShadow.sm'),
      borderRadius: config('theme.borderRadius.md'),
      overflow: 'hidden',
      textAlign: 'left',
      color: config('theme.colors.gray-500'),
    },
    'thead th': {
      backgroundColor: config('theme.colors.gray-200'),
      textTransform: 'uppercase',
      fontSize: config('theme.fontSize.xs'),
    },
    'tbody td': {
      fontSize: config('theme.fontSize.sm'),
    },
    'tbody tr:not(:last-child)': {
      borderBottom: `${config('theme.borderWidth.default')} solid ${config('theme.colors.gray-200')}`
    },
    'td, th': {
      padding: config('theme.spacing.4'),
      backgroundColor: config('theme.color.white'),
    },
  };
  addBase(tables);
});

const fontSizes = {
  xxs: '.625rem',
  xs: '.75rem',
  sm: '.938rem',
  base: '1rem',
  lg: '1.063rem',
  xl: '1.25rem',
  '2xl': '1.438rem',
  '3xl': '1.688rem',
  '4xl': '2rem',
  '5xl': '2.5rem',
};
module.exports = {
  theme: {
    fontFamily: {
      lato: [
        'lato',
        'sans-serif',
      ],
    },
    gradients: {
      'primary-gradient': ['45deg', '#254E81', '#2C7EA1'],
    },
    boxShadow: {
      default: '0px 0px 1px rgba(40, 51, 65, 0.2), 0px 1px 4px rgba(40, 51, 65, 0.1)',
      sm: '0px 0px 1px rgba(40, 51, 65, 0.2), 0px 1px 4px rgba(40, 51, 65, 0.1)',
      md: '0px 3px 12px rgba(40, 51, 65, 0.1), 0px 0px 1px rgba(40, 51, 65, 0.2)',
      lg: '0px 4px 16px rgba(40, 51, 65, 0.1), 0px 0px 1px rgba(40, 51, 65, 0.2)',
      inner: 'inset 0px 1px 2px rgba(40, 51, 65, 0.1)',
    },
    colors: {
      transparent: 'transparent',
      'dark-blue': '#254E81',
      'primary-blue': '#2C7EA1',
      'purple-600': '#6638AE',
      'purple-500': '#713EC1',
      'purple-400': '#8E65CD',
      'purple-300': '#AA8BDA',
      'purple-200': '#C6B2E6',
      'purple-100': '#EEE8F8',
      'red-600': '#C2243F',
      'red-500': '#D72846',
      'red-400': '#DF536B',
      'red-300': '#E77E90',
      'red-200': '#EFA9B5',
      'red-100': '#FAE5E9',
      'orange-600': '#DD6309',
      'orange-500': '#F56E0A',
      'orange-400': '#F78B3B',
      'orange-300': '#F9A86C',
      'orange-200': '#FBC59D',
      'orange-100': '#FEEEE1',
      'green-600': '#29A38A',
      'green-500': '#34CBAD',
      'green-400': '#5CD6BD',
      'green-300': '#85E0CE',
      'green-200': '#AEEADE',
      'green-100': '#EBFAF7',
      'blue-600': '#14ABD2',
      'blue-500': '#16BEE9',
      'blue-400': '#44CBEE',
      'blue-300': '#73D8F2', 
      'blue-200': '#A1E5F7',
      'blue-100': '#E3F7FC',
      'gray-600': '#283341',
      'gray-500': '#41556C',
      'gray-400': '#7187A5',
      'gray-300': '#D3E0F1',
      'gray-200': '#F1F6FC',
      'gray-100': '#F8FAFD',
      white: '#FFFFFF',
      black: '#000000',
    },
    borderRadius: {
      sm: '4px',
      default: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    fontSize: fontSizes,
    borderWidth: {
      default: '1px',
      0: '0',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    extend: {
      spacing: {
        ...fontSizes,
      },
      zIndex: {
        '-1': '-1',
      },
    },
  },
  variants: {
    gradients: ['responsive', 'hover'],
    transitionProperty: ['responsive', 'hover', 'focus'],
  },
  plugins: [
    checTablesPlugin,
    gradientsPlugin,
  ],
};
