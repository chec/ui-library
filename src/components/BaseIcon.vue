<script>
import IcLeft from '../assets/svgs/IconBasic/ic-left.svg';
import IcRight from '../assets/svgs/IconBasic/ic-right.svg';
import IcClose from '../assets/svgs/IconBasic/ic-close.svg';
import IcCheck from '../assets/svgs/IconBasic/ic-check.svg';

export default {
  name: 'BaseIcon',
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
  render(createElement) {
    let icon;

    switch (this.icon) {
      case 'left':
        icon = IcLeft;
        break;
      case 'right':
        icon = IcRight;
        break;
      case 'close':
        icon = IcClose;
        break;
      case 'check':
        icon = IcCheck;
        break;

      default:
        throw Error('Required param "icon" was not invalid');
    }
    return createElement(icon);
  },
};
</script>
<style lang="scss" scoped>
</style>
