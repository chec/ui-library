const tailwind = require('tailwindcss-plugins/gradients');

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
      sm: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      md: '0px 6px 12px rgba(0, 0, 0, 0.1)',
      lg: '0px 8px 16px rgba(0, 0, 0, 0.1)',
      inner: 'inset 0px 1px 2px rgba(0, 0, 0, 0.1)',
    },
    colors: {
      'dark-blue': '#254E81',
      'primary-blue': '#2C7EA1',
      'purple-300': '#A686D8',
      'red-300': '#E78091',
      'red-200': '#EFA9B5',
      'orange-300': '#FAAF78',
      'green-300': '#50D29C',
      'blue-300': '#5ED2F0',
      'gray-900': '#283341',
      'gray-700': '#41556C',
      'gray-500': '#41556C',
      'gray-400': '#7187A5',
      'gray-300': '#D3E0F1',
      'gray-200': '#F1F6FC',
      'gray-100': '#F8FAFD',
      white: '#FFFFFF',
    },
    borderRadius: {
      sm: '3px',
      default: '6px',
      lg: '12px',
    },
    fontSize: {
      xs: '.75rem',
      sm: '.938rem',
      base: '1rem',
      lg: '1.063rem',
      xl: '1.25rem',
      '2xl': '1.438rem',
      '3xl': '1.688rem',
      '4xl': '2rem',
      '5xl': '2.5rem',
    },
    extend: {},
  },
  variants: {
    gradients: ['responsive', 'hover'],
  },
  plugins: [
    tailwind,
  ],
};
