import Components from './components';
import config from './../tailwind.config.js';
import SvgIcons from './assets/svgs'

export default {
  config,
  ...Components,
  icons: {
    ...SvgIcons
  }
};
