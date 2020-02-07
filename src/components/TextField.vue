<template>
  <input
    class="input"
    :value="value"
    :placeholder="placeholder"
    :disabled="this.variant === 'disabled'"
    :class="classNames"
    @input="onInput"
    />
</template>
<script>
export default {
  name: 'TextField',
  props: {
    /**
     * The state of the text field. One of "disabled", "error".
     */
    variant: {
      type: String,
      default: ''
    },
    /**
     * The value the v-model directive utilizes, see https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
     */
    value: {
      type: String,
      default: ''
    },
    /**
     * The value used for the inner `<input>`'s placeholder html attribute
     */
    placeholder: {
      type: String,
      default: 'Text Field'
    }
  },
  computed: {
    classNames() {
      return {
        'opacity-50 input--disabled': this.variant === 'disabled',
        'input--error': this.variant === 'error'
      }
    }
  },
  methods: {
    onInput($event) {
      /**
       * Emitted when the `<input>`'s 'input' event bubbles up. The v-model directive uses this to function.
       * @event input
       * @type {$event.target.value}
       */
      this.$emit('input', $event.target.value)
    }
  }
};
</script>
<style lang="scss" scoped>
.input {
  @apply text-base text-gray-500 p-4 bg-gray-200 rounded border border-gray-300 shadow-inner outline-none;
  &:hover,
  &:focus,
  &:active {
    @apply border-primary-blue;
  };
  &--disabled {
    &:hover,
    &:focus,
    &:active {
      @apply border-gray-300;
    };
  };
  &--error {
    @apply border-red-300;
    &:hover,
    &:focus,
    &:active {
      @apply border-red-200;
    };
  };
}
</style>
