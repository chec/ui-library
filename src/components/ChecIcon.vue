<script>
import { uiIcons } from '@/lib/icons';

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
    /**
     * The size of the icon if it matches font size
     */
    size: {
      type: String,
      default: null,
    },
  },
  render(createElement, { props, data }) {
    if (!uiIcons[props.icon]) {
      throw Error(`Required param "icon" was not valid (${props.icon} given)`);
    }

    const updatedData = data;

    if (props.size) {
      updatedData.class = [`icon-${props.size}`, data.class];
    }

    return createElement(uiIcons[props.icon], updatedData);
  },
};
</script>
