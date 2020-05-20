import FlatPickr from 'vue-flatpickr-component';
import baseFlatpickr from 'flatpickr';
import TextField from './TextField.vue';
import ChecFlatpickrPlugin from '../lib/flatpickr/formattingPlugin';

import 'flatpickr/dist/flatpickr.css';
import '../assets/datepicker.scss';

const { config, ...parentProps } = FlatPickr.props;

baseFlatpickr.l10ns.default.weekdays.shorthand = ['S', 'M', 'T', 'W', 'TH', 'F', 'S'];

export default {
  ...FlatPickr,
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
    // Figure out the date format for the browser
    let dateFormat = (new Date(1999, 1, 3)).toLocaleDateString();

    dateFormat = dateFormat.replace('03', 'd');
    dateFormat = dateFormat.replace('3', 'j');
    dateFormat = dateFormat.replace('02', 'm');
    dateFormat = dateFormat.replace('2', 'n');
    dateFormat = dateFormat.replace('1999', 'Y');
    dateFormat = dateFormat.replace('99', 'y');

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
    return h(TextField, {
      props: {
        label,
        variant,
        value,
        disabled: variant === 'disabled',
      },
      on: {
        input: (_, event) => {
          this.onInput(event);
        },
      },
    });
  },
};
