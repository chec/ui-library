<script>
import { mIcons } from '../lib/icons';

export default {
  name: 'ChecMarketingIcon',
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
    if (!mIcons[this.icon]) {
      throw Error('Required param "icon" was not valid');
    }
    return createElement(mIcons[this.icon]);
  },
};
</script>
