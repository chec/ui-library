<template>
  <input
    class="input"
    type="text"
    :value="value"
    :placeholder="placeholder"
    :disabled="this.variant === 'disabled'"
    :class="classNames"
    @input="handleInput"
    @focus="handleFocus"
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
      default: '',
    },
    /**
     * The value the v-model directive utilizes
     * @see https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
     */
    value: {
      type: String,
      default: '',
    },
    /**
     * The value used for the inner `<input>`'s placeholder html attribute
     */
    placeholder: {
      type: String,
      default: '',
    },
  },
  computed: {
    classNames() {
      return {
        'opacity-50 input--disabled': this.variant === 'disabled',
        'input--error': this.variant === 'error',
        'input--empty': this.value === '',
      };
    },
  },
  methods: {
    handleInput($event) {
      /**
       * Emitted when the `<input>`'s 'input' event bubbles up. The v-model directive uses this to function.
       * @event input
       * @type {$event.target.value}
       */
      this.$emit('input', $event.target.value);
    },
    handleFocus($event) {
      $event.target.select();
    },
  },
};
</script>
<style lang="scss" scoped>
.input {
  @apply
    leading-tight
    text-sm
    text-gray-500
    p-4
    bg-white
    rounded
    shadow-sm
    border
    outline-none;

  border-color: transparent;

  &:hover {
    @apply border-gray-400;
  }

  &:focus,
  &:active {
    @apply border-gray-500;
  }

  &--disabled {
    &:hover,
    &:focus,
    &:active {
      @apply border-gray-300;
    };
  };
  &--error,
  &:not(.input--empty):invalid {
    @apply border-red-300;
    &:hover,
    &:focus,
    &:active {
      @apply border-red-200;
    };
  };
}
</style>
