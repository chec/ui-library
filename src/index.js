import Components from './components';
import config from '../tailwind.config';
import SvgIcons from './assets/svgs';

export default {
  config,
  ...Components,
  icons: {
    ...SvgIcons,
  },
};
