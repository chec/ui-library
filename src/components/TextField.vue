<template>
  <div class="text-field">
    <input
      class="input"
      type="text"
      :value="value"
      :placeholder="placeholder"
      :disabled="this.variant === 'disabled'"
      :class="classNames"
      :id='$inputId'
      @input="[handleInput, innerInputClass]"
      @focus="handleFocus"
    />
    <label class="text-field__label" :for="$inputId">
      {{ label }}
    </label>
  </div>
</template>
<script>
import uniqueId from '@/lib/helpers/createUniqueId';

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
    /**
     * Class to pass to inner input element
     */
    innerInputClass: {
      type: String,
      default: 'label',
    },
    /**
     * Label for input
     */
    label: {
      type: String,
      default: 'Label',
    },
  },
  created() {
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
.text-field {
  @apply relative;
  &__label {
    @apply absolute top-0 left-0 w-full pt-2 pl-4 text-xs text-gray-500;
  }
  .input {
    @apply
      leading-tight
      text-sm
      text-gray-500
      w-full
      px-4
      pb-2
      pt-6
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
    .input {
      @apply pb-2 pt-6;
    }
  }
}
</style>
