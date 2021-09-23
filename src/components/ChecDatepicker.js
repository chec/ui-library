import FlatPickr from 'vue-flatpickr-component';
import baseFlatpickr from 'flatpickr';
import TextField from './TextField.vue';
import ChecIcon from './ChecIcon.vue';
import ChecFlatpickrPlugin from '../lib/flatpickr/formattingPlugin';

import 'flatpickr/dist/flatpickr.css';
import '../assets/datepicker.scss';

const { config, ...parentProps } = FlatPickr.props;

baseFlatpickr.l10ns.default.weekdays.shorthand = ['S', 'M', 'T', 'W', 'TH', 'F', 'S'];

export default {
  ...FlatPickr,
  inheritAttrs: false,
  name: 'ChecDatepicker',
  props: {
    ...parentProps,
    /**
     * The label of the input
     * @see TextField
     */
    label: {
      type: String,
      default: '',
    },
    /**
     * The variant of the input
     * @see TextField
     */
    variant: {
      type: String,
      default: '',
    },
  },
  data() {
    // Use a predictable date format instead of the locale's format
    // see https://github.com/flatpickr/flatpickr/issues/2129
    // todo use the browser's locale when that issue is resolved upstream
    const dateFormat = 'Y-m-d';

    return {
      fp: null,
      config: {
        wrap: true,
        defaultDate: null,
        allowInput: true,
        dateFormat,
        plugins: [
          new ChecFlatpickrPlugin(),
        ],
      },
    };
  },
  render(h) {
    const { label, variant, value } = this;
    return h(
      TextField,
      {
        attrs: this.$attrs,
        props: {
          label,
          variant,
          value,
          additionalInputAttributes: { 'data-input': true },
          disabled: variant === 'disabled',
        },
        on: {
          input: (_, event) => {
            this.onInput(event);
          },
        },
      },
      [
        h(ChecIcon, {
          props: {
            icon: 'calendar',
          },
          class: 'w-4 h-4',
        }),
      ],
    );
  },
};
