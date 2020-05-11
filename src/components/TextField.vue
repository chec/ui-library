<template>
  <div class="text-field" :class="{ 'text-field--with-inline-label': this.isFocus }">
    <input
      class="input"
      :type="$attrs.type || 'text'"
      :value="value"
      :disabled="this.variant === 'disabled'"
      :class="classNames"
      :id='$inputId'
      @input="[handleInput, innerInputClass]"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <label v-if="label" class="text-field__label" :for="$inputId">
      {{ shownLabel }}
    </label>
  </div>
</template>
<script>
import uniqueId from '@/lib/helpers/createUniqueId';

export default {
  name: 'TextField',
  inheritAttrs: false,
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
    /**
     * Class to pass to inner input element
     */
    innerInputClass: {
      type: String,
      default: '',
    },
    /**
     * Label for input
     */
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isFocus: false,
    };
  },
  created() {
    if (this.value !== '') {
      this.isFocus = true;
    }
    this.$inputId = uniqueId(this.name, this.value, 'chec-switch')();
  },
  computed: {
    classNames() {
      return {
        'opacity-50 input--disabled': this.variant === 'disabled',
        'input--error': this.variant === 'error',
        'input--empty': this.value === '',
      };
    },
    /**
     * The Label that should be shown if placeholder supplied
     *
     * @returns {string|*}
     */
    shownLabel() {
      if (!this.isFocus) {
        return this.placeholder || this.label;
      }
      return this.label;
    },
  },
  watch: {
    value(value) {
      this.isFocus = false;
      if (value) {
        this.isFocus = true;
      }
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
      this.isFocus = true;
      $event.target.select();
    },
    handleBlur() {
      if (this.value === '') {
        this.isFocus = false;
      }
    },
  },
};
</script>
<style lang="scss">
.text-field {
  @apply relative;
  &__label {
    @apply absolute top-0 left-0 w-full pt-4 text-sm text-gray-500;
    padding-left: calc(1rem + 1px);
  }
  .input {
    @apply
      leading-tight
      text-sm
      text-gray-500
      w-full
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
      + .text-field__label {
        @apply opacity-75 transition-opacity duration-300 ease-in-out;
      }
    };

    &--disabled {
      &:hover,
      &:focus,
      &:active {
        @apply border-gray-300;
      };
      + .text-field__label {
        @apply opacity-50 transition-opacity duration-300 ease-in-out;
      }
    }

    &--error,
    &:not(.input--empty):invalid {
      @apply border-red-300;
      &:hover,
      &:focus,
      &:active {
        @apply border-red-200;
      }
    }
  }

  &--with-inline-label {
    .text-field__label {
      @apply pt-2 text-xs;
      padding-left: calc(1rem + 1px);
    }
    .input{
      @apply pt-6 pb-2;
    }
  }
}
</style>
