const gradientsPlugin = require('tailwindcss-plugins/gradients');
const plugin = require('tailwindcss/plugin');
const checTablesPlugin = require('./tailwind-plugins/tables');
const checTypeographyPlugin = require('./tailwind-plugins/typography');
const checIconSizePlugin = require('./tailwind-plugins/iconSize');
const checHazardBorderPlugin = require('./tailwind-plugins/hazardBorder');

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
  '6xl': '2.75rem',
};

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: Boolean(process.env.PURGE_ENABLED),
    content: [
      './components/**/*.vue',
      './components/*.vue',
      './components/*.js',
      './tailwind-plugins/**/*.js',
    ],
  },
  theme: {
    fontFamily: {
      lato: [
        'Lato',
        'sans-serif',
      ],
      mono: [
        'Source Code Pro',
        'monospace',
      ],
    },
    gradients: {
      'primary-gradient': ['80.19deg', '#254E81', '#2C7EA1'],
      'gray-gradient': ['80deg', '#F1F6FC', '#F8FAFD'],
      'dark-gray-gradient': ['180deg', '#41556C', '#7087A5'],
      'vertical-transparent-gradient': ['0deg', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)'],
      'chec-gradient': ['270deg', '#FBC59D', '#EFA9B5', '#BDB2E6'],
    },
    boxShadow: {
      default: '0px 0px 1px rgba(40, 51, 65, 0.2), 0px 1px 4px rgba(40, 51, 65, 0.1)',
      sm: '0px 0px 1px rgba(40, 51, 65, 0.1), 0px 1px 2px rgba(40, 51, 65, 0.1), 0px 1px 3px rgba(40, 51, 65, 0.1)',
      md: '0px 3px 12px rgba(40, 51, 65, 0.1), 0px 0px 1px rgba(40, 51, 65, 0.2)',
      lg: '0px 4px 16px rgba(40, 51, 65, 0.1), 0px 0px 1px rgba(40, 51, 65, 0.2)',
      'light-focus': '0px 0px 0px 4px #D6E4F7',
      'dark-focus': '0px 0px 0px 4px #41546C',
      'error-focus': '0 0 0 4px rgba(231, 126, 143, 0.3)',
      inner: 'inset 0px 0px 1px rgba(40, 51, 65, 0.2), '
        + 'inset 0px 1px 1px rgba(40, 51, 65, 0.1), '
        + 'inset 0px 2px 2px rgba(40, 51, 65, 0.1)',
      none: 'none',
      holo: '4px -4px 16px rgba(156, 139, 218, 0.1), -4px -4px 16px rgba(115, 200, 242, 0.1),'
        + '-4px 4px 16px rgba(133, 224, 206, 0.1), 4px 4px 16px rgba(231, 126, 144, 0.1),'
        + '0px 4px 12px rgba(40, 51, 65, 0.1), 0px 0px 4px rgba(40, 51, 65, 0.1)',
      'holo-light': '0px 0px 4px rgba(40, 51, 65, 0.1), 0px 4px 12px rgba(40, 51, 65, 0.1),'
        + '4px 4px 16px rgba(231, 126, 144, 0.1), -4px 4px 16px rgba(133, 224, 206, 0.1),'
        + '-4px -4px 16px rgba(115, 200, 242, 0.1), 4px -4px 16px rgba(156, 139, 218, 0.1);',
    },
    colors: {
      transparent: 'transparent',
      'dark-blue': '#254E81',
      'primary-blue': '#2C7EA1',
      'purple-600': '#5138AE',
      'purple-500': '#5B3EC1',
      'purple-400': '#7B65CD',
      'purple-300': '#9C8BDA',
      'purple-200': '#BDB2E6',
      'purple-100': '#F5F3FB',
      'red-600': '#C1243F',
      'red-500': '#D72846',
      'red-400': '#DF536B',
      'red-300': '#E77E90',
      'red-200': '#EFA9B5',
      'red-100': '#FCF2F4',
      'orange-600': '#DC6509',
      'orange-500': '#F56E0A',
      'orange-400': '#F78B3B',
      'orange-300': '#F9A86C',
      'orange-200': '#FBC59D',
      'orange-100': '#FEF6F0',
      'green-600': '#29A38A',
      'green-500': '#34CBAD',
      'green-400': '#5CD6BD',
      'green-300': '#85E0CE',
      'green-200': '#AEEADE',
      'green-100': '#F3FCFA',
      'blue-600': '#1493D2',
      'blue-500': '#16A3E9',
      'blue-400': '#44B5EE',
      'blue-300': '#73C8F2',
      'blue-200': '#A1DAF7',
      'blue-100': '#F1F9FE',
      'gray-700': '#151B23',
      'gray-600': '#283341',
      'gray-500': '#41546C',
      'gray-400': '#7187A5',
      'gray-300': '#D6E4F7',
      'gray-200': '#F1F6FC',
      'gray-100': '#F8FAFD',
      'overlay-gray': 'rgba(65, 85, 108, 0.9)',
      'overlay-white': 'rgba(255, 255, 255, 0.95)',
      white: '#FFFFFF',
      black: '#000000',
    },
    borderRadius: {
      none: '0',
      sm: '2px',
      default: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    fontSize: fontSizes,
    letterSpacing: {
      tightest: '-.12em',
      tighter: '-.085em',
      tight: '-.025em',
      normal: '0',
      wide: '.025em',
      wider: '.085em',
      widest: '.12em',
    },
    borderWidth: {
      default: '1px',
      0: '0',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    maxHeight: {
      0: '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%',
      'full-px': '9999px',
    },
    extend: {
      spacing: {
        ...fontSizes,
      },
      zIndex: {
        '-1': '-1',
        75: 75,
        100: 100,
      },
      opacity: {
        10: '0.1',
        20: '0.2',
        40: '0.4',
      },
      margin: {
        '-30': '-7.5rem',
      },
      width: {
        '1/11': '9.090909%',
        '2/11': '18.181818%',
        '3/11': '27.272727%',
        '4/11': '36.3636363%',
        '5/11': '45.4545454%',
        '6/11': '54.5454545%',
        '7/11': '63.6363636%',
        '8/11': '72.7272727%',
        '9/11': '81.8181818%',
        '10/11': '90.9090909%',
        '11/11': '100%',
        50: '50vw',
        33: '33.333333vw',
        75: '75vw',
      },
      transitionDuration: {
        600: '600ms',
      },
      transitionDelay: {
        400: '400ms',
      },
      backgroundOpacity: {
        75: '0.75',
        80: '0.80',
      },
    },
  },
  variants: {
    gradients: ['responsive', 'hover'],
    transitionProperty: ['responsive', 'hover', 'focus'],
  },
  plugins: [
    checTablesPlugin,
    checTypeographyPlugin,
    checIconSizePlugin,
    checHazardBorderPlugin,
    gradientsPlugin,
    plugin(({ addUtilities }) => addUtilities({
      '.bg-hologram': {
        backgroundImage: `
          linear-gradient(
            132.37deg,
            rgba(214, 228, 247, 0.83) 13.76%,
            rgba(214, 228, 247, 0.46) 85.32%
          ),
          linear-gradient(
            135deg,
            #ACC9DA 10.42%,
            #E7AED2 20.31%,
            #FF9ECA 31.77%,
            #6EFFFB 47.92%,
            #BCFFDF 53.65%,
            #FF9FB4 69.27%,
            #ACB8DA 91.86%
          )`,
      },
      '.bg-hologram-light': {
        backgroundImage: `
          linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.9),
            rgba(255, 255, 255, 0.9)
          ),
          linear-gradient(
            132.37deg,
            rgba(214, 228, 247, 0.83) 13.76%,
            rgba(214, 228, 247, 0.46) 85.32%
          ),
          linear-gradient(
            135deg,
            #ACC9DA 10.42%,
            #E7AED2 20.31%,
            #FF9ECA 31.77%,
            #6EFFFB 47.92%,
            #BCFFDF 53.65%,
            #FF9FB4 69.27%,
            #ACB8DA 91.86%
          )`,
      },
      '.bg-code-block': {
        backgroundImage: 'inline("../assets/svgs/code-bg.svg")',
      },
    })),
  ],
};
