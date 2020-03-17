<script>
import { navIcons } from '../lib/icons';

export default {
  name: 'ChecNavIcon',
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
    if (!navIcons[this.icon]) {
      throw Error('Required param "icon" was not valid');
    }
    return createElement(navIcons[this.icon]);
  },
};
</script>
