<template>
  <div class="date-picker-navigation">
    <ChecHorizontalSpinner
      :options="months"
      :value="monthName"
      value-width="1.7rem"
      class="date-picker-navigation__spinner"
      @input="chooseMonth"
    />
    <ChecHorizontalSpinner
      :options="years"
      :value="`${year}`"
      value-width="2.2rem"
      class="date-picker-navigation__spinner"
      @input="chooseYear"
    />
  </div>
</template>

<script>
import baseFlatpickr from 'flatpickr';
import ChecHorizontalSpinner from '../ChecHorizontalSpinner.vue';

export default {
  name: 'DatePickerNavBar',
  components: { ChecHorizontalSpinner },
  props: {
    picker: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      months: baseFlatpickr.l10ns.default.months.shorthand,
    };
  },
  computed: {
    years() {
      if (!this.year) {
        return [];
      }
      return [this.year - 1, this.year, this.year + 1].map(y => `${y}`);
    },
    monthName() {
      return this.months[this.month];
    },
    month() {
      return this.picker.currentMonth;
    },
    year() {
      return this.picker.currentYear;
    },
  },
  methods: {
    chooseMonth(month, prevMonth) {
      this.picker.changeMonth(this.months.findIndex(candidate => candidate === month), false);

      if (prevMonth === this.months[0] && month === this.months[11]) {
        this.chooseYear(this.year - 1);
      } else if (prevMonth === this.months[11] && month === this.months[0]) {
        this.chooseYear(this.year + 1);
      }
    },
    chooseYear(year) {
      this.picker.changeYear(parseInt(year, 10));
    },
  },
};
</script>

<style lang="scss">
.date-picker-navigation {
  @apply w-full flex justify-between mb-4;
}
</style>
