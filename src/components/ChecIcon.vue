<script>
import { uiIcons } from '../lib/icons';

export default {
  name: 'ChecIcon',
  functional: true,
  props: {
    /**
     * Name of the icon ie. `icon="left"`
     */
    icon: {
      type: String,
      required: true,
    },
  },
  render(createElement, { props, data }) {
    if (!uiIcons[props.icon]) {
      throw Error('Required param "icon" was not valid');
    }
    return createElement(uiIcons[props.icon], data);
  },
};
</script>
