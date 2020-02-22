<script>
import IcLeft from '../assets/svgs/IconBasic/ic-left.svg';
import IcRight from '../assets/svgs/IconBasic/ic-right.svg';
import IcDown from '../assets/svgs/IconBasic/ic-down.svg';
import IcUp from '../assets/svgs/IconBasic/ic-up.svg';
import IcPlus from '../assets/svgs/IconBasic/ic-plus.svg';
import IcClose from '../assets/svgs/IconBasic/ic-close.svg';
import IcCheck from '../assets/svgs/IconBasic/ic-check.svg';
import IcMore from '../assets/svgs/IconBasic/ic-more.svg';
import IcDownload from '../assets/svgs/IconBasic/ic-download.svg';
import IcUpload from '../assets/svgs/IconBasic/ic-upload.svg';
import IcGrip from '../assets/svgs/IconBasic/ic-grip.svg';
import IcMinus from '../assets/svgs/IconBasic/ic-minus.svg';

export default {
  name: 'Icon',
  props: {
    /**
     * Type of the icon
     */
    icon: {
      type: String,
      required: true,
    },
    /**
     * Size of the icon `12px` or `16px`
     */
    size: {
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
      case 'down':
        icon = IcDown;
        break;
      case 'up':
        icon = IcUp;
        break;
      case 'plus':
        icon = IcPlus;
        break;
      case 'close':
        icon = IcClose;
        break;
      case 'check':
        icon = IcCheck;
        break;
      case 'more':
        icon = IcMore;
        break;
      case 'download':
        icon = IcDownload;
        break;
      case 'upload':
        icon = IcUpload;
        break;
      case 'grip':
        icon = IcGrip;
        break;
      case 'minus':
        icon = IcMinus;
        break;
      default:
        throw Error('Required param "icon" was not invalid');
    }
    return createElement(icon);
  },
};
</script>
