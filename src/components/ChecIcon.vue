<script>
import { uiIcons } from '../lib/icons';

export default {
  name: 'ChecIcon',
  props: {
    /**
     * Type of icon
     */
    icon: {
      type: String,
      required: true,
    },
  },
  render(createElement) {
    if (!uiIcons[this.icon]) {
      throw Error('Required param "icon" was not valid');
    }
    return createElement(uiIcons[this.icon]);
  },
};
</script>
