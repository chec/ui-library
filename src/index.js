import Components from './components';
import config from './../tailwind.config.js';
import SvgIcons from './assets/svgs'

module.exports = {
  config,
  ...Components,
  icons: {
    ...SvgIcons
  }
};
