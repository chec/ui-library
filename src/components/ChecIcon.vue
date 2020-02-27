<script>
import icons from '../lib/icons';

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
    /**
     * Choose any color available in our pallete
     */
  },
  render(createElement) {
    if (!icons[this.icon]) {
      throw Error('Required param "icon" was not valid');
    }
    return createElement(icons[this.icon]);
  },
};
</script>
