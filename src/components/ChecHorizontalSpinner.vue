<template>
  <div class="chec-horizontal-spinner">
    <button class="chec-horizontal-spinner__button" @click="handlePrevious">
      <ChecIcon icon="left" />
    </button>
    <span class="chec-horizontal-spinner__value" :style="computedStyle">{{ value }}</span>
    <button class="chec-horizontal-spinner__button" @click="handleNext">
      <ChecIcon icon="right" />
    </button>
  </div>
</template>

<script>
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecHorizontalSpinner',
  components: { ChecIcon },
  props: {
    /**
     * An array of strings that make up the options in this spinner
     *
     * @type {Array<String>}
     */
    options: {
      type: Array,
      required: true,
    },

    /**
     * `v-model` binding for the currently selected value
     */
    value: {
      type: String,
      required: true,
    },
    /**
     * An optional definition for the width of the option label in the spinner. This is available to prevent the
     * spinner from resizing based on the width of the currently selected option. This should be provided as a valid
     * value for a `width` CSS definition, e.g. `5rem`
     */
    valueWidth: String,
  },
  computed: {
    computedStyle() {
      if (this.valueWidth) {
        return { width: this.valueWidth };
      }

      return {};
    },
  },
  methods: {
    handlePrevious() {
      this.navigate(-1);
    },
    handleNext() {
      this.navigate(1);
    },
    navigate(indexModification) {
      const selectedOption = this.options.findIndex(candidate => candidate === this.value);
      const currentIndex = selectedOption > 0 ? selectedOption : 0;
      const optionsLength = this.options.length;
      let newIndex = currentIndex + indexModification;

      if (newIndex < 0) {
        newIndex += optionsLength;
      } else if (newIndex > (optionsLength - 1)) {
        newIndex -= optionsLength;
      }

      /**
       * v-model binding event for a change. Provides both the new option and the old option as event args
       *
       * @event input
       * @type {String}
       */
      this.$emit('input', this.options[newIndex], this.options[currentIndex]);
    },
  },
};
</script>

<style lang="scss">
.chec-horizontal-spinner {
  @apply text-gray-600 font-lato;

  &__button {
    padding: 10px;

    svg {
      @apply w-3 h-3;
    }
  }

  &__value {
    @apply font-bold inline-block text-center;
  }
}
</style>
